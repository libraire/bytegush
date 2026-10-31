import { ToolDefinition, Recipe, CheatSheetItem, CheatSheetCategory } from './types';

// =================== 常用辅助纯函数 ===================

export function base64Encode(str: string): string {
  try {
    return btoa(unescape(encodeURIComponent(str)));
  } catch {
    try {
      return Buffer.from(str, 'utf-8').toString('base64');
    } catch {
      return 'Error: Base64 encode failed';
    }
  }
}

export function base64Decode(b64: string): string {
  try {
    return decodeURIComponent(escape(atob(b64)));
  } catch {
    try {
      return Buffer.from(b64, 'base64').toString('utf-8');
    } catch {
      return 'Error: Base64 decode failed';
    }
  }
}

const smallWords = /^(a|an|and|as|at|but|by|en|for|if|in|nor|of|on|or|per|the|to|v.?|vs.?|via)$/i;

export function toTitleCase(str: string): string {
  return str
    .split('\n')
    .map((line) =>
      line
        .split(' ')
        .map((word, idx) => {
          if (idx > 0 && smallWords.test(word)) {
            return word.toLowerCase();
          }
          return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
        })
        .join(' ')
    )
    .join('\n');
}

export function httpHeadersToJSON(text: string): string {
  try {
    const lines = text.trim().split(/[\r\n]+/);
    const obj: Record<string, string> = {};
    for (const line of lines) {
      const colonIdx = line.indexOf(':');
      if (colonIdx > 0) {
        const key = line.slice(0, colonIdx).trim();
        const val = line.slice(colonIdx + 1).trim();
        obj[key] = val;
      }
    }
    return JSON.stringify(obj, null, 2);
  } catch (err: any) {
    return 'Error parsing headers: ' + err.message;
  }
}

interface ParsedColumn {
  name: string;
  rawType: string;
  cleanType: string;
  comment?: string;
}

function parseSqlColumns(ddl: string): { tableName: string; columns: ParsedColumn[] } {
  const tableMatch = ddl.match(
    /create\s+table\s+(?:if\s+not\s+exists\s+)?(?:`|")?([a-zA-Z0-9_]+)(?:`|")?\s*\(([\s\S]+)\)/i
  );
  const tableName = tableMatch ? tableMatch[1] : 'GeneratedEntity';
  const body = tableMatch ? tableMatch[2] : ddl;

  const lines = body.split(/\r?\n/);
  const columns: ParsedColumn[] = [];

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line || line.startsWith('--') || line.startsWith('/*')) continue;
    if (/^(primary\s+key|key|unique\s+key|constraint|index)/i.test(line)) continue;

    const colMatch = line.match(
      /^(?:`|")?([a-zA-Z0-9_]+)(?:`|")?\s+([a-zA-Z0-9_]+(?:\s*\([^)]*\))?)/i
    );
    if (colMatch) {
      const name = colMatch[1];
      const rawType = colMatch[2];
      const commentMatch = line.match(/comment\s+'([^']*)'/i);
      const comment = commentMatch ? commentMatch[1] : undefined;

      columns.push({
        name,
        rawType,
        cleanType: rawType.split('(')[0].toLowerCase(),
        comment,
      });
    }
  }

  return { tableName, columns };
}

function mapSqlToTypes(cleanType: string): { ts: string; java: string } {
  switch (cleanType) {
    case 'tinyint':
    case 'smallint':
    case 'mediumint':
    case 'int':
    case 'integer':
      return { ts: 'number', java: 'Integer' };
    case 'bigint':
      return { ts: 'number', java: 'Long' };
    case 'float':
    case 'double':
    case 'decimal':
    case 'numeric':
      return { ts: 'number', java: 'BigDecimal' };
    case 'char':
    case 'varchar':
    case 'tinytext':
    case 'text':
    case 'mediumtext':
    case 'longtext':
      return { ts: 'string', java: 'String' };
    case 'date':
    case 'datetime':
    case 'timestamp':
      return { ts: 'string | Date', java: 'Date' };
    case 'boolean':
    case 'bool':
      return { ts: 'boolean', java: 'Boolean' };
    case 'json':
      return { ts: 'Record<string, any>', java: 'String' };
    default:
      return { ts: 'string', java: 'String' };
  }
}

function toCamelCase(str: string): string {
  return str.replace(/_([a-zA-Z0-9])/g, (_, p1) => p1.toUpperCase());
}

function toPascalCase(str: string): string {
  const camel = toCamelCase(str);
  return camel.charAt(0).toUpperCase() + camel.slice(1);
}

// =================== 注册的所有 Woop 工具 ===================

export const ALL_TOOLS: ToolDefinition[] = [
  // --- Case & Text ---
  {
    id: 'UpperCase',
    name: '大写字母 (Upper Case)',
    category: 'case',
    categoryLabel: '大小写与文本',
    description: '将输入中的所有英文字母转换为大写',
    run: (t) => t.toUpperCase(),
  },
  {
    id: 'LowerCase',
    name: '小写字母 (Lower Case)',
    category: 'case',
    categoryLabel: '大小写与文本',
    description: '将输入中的所有英文字母转换为小写',
    run: (t) => t.toLowerCase(),
  },
  {
    id: 'TitleCase',
    name: '英文标题规范 (Title Case)',
    category: 'case',
    categoryLabel: '大小写与文本',
    description: '每行单词首字母大写（自动避开 a/an/the 等虚词）',
    run: (t) => toTitleCase(t),
  },
  {
    id: 'HumpToUnderline',
    name: '驼峰转下划线 (Camel ➔ Snake)',
    category: 'case',
    categoryLabel: '大小写与文本',
    description: '例如 userFirstName ➔ user_first_name',
    run: (t) => t.replace(/\B([A-Z])/g, '_$1').toLowerCase(),
  },
  {
    id: 'UnderlineToHump',
    name: '下划线转驼峰 (Snake ➔ Camel)',
    category: 'case',
    categoryLabel: '大小写与文本',
    description: '例如 user_first_name ➔ userFirstName',
    run: (t) => t.replace(/_([a-zA-Z0-9])/g, (_, e) => e.toUpperCase()),
  },

  // --- Lines & Space ---
  {
    id: 'TrimSpace',
    name: '清理首尾与冗余空格 (Trim Space)',
    category: 'lines',
    categoryLabel: '空格与行处理',
    description: '去除每行首尾空格，并将连续多个空格压缩为一个',
    run: (t) =>
      t
        .split('\n')
        .map((line) => line.replace(/\t/g, ' ').replace(/\s\s+/g, ' ').trim())
        .join('\n'),
  },
  {
    id: 'RemoveSpace',
    name: '去除所有空白字符 (Remove Whitespace)',
    category: 'lines',
    categoryLabel: '空格与行处理',
    description: '清除文本中全部空格、制表符与无用空白',
    run: (t) => t.replace(/[ \t]/g, ''),
  },
  {
    id: 'Unindent',
    name: '消除公共缩进 (Unindent)',
    category: 'lines',
    categoryLabel: '空格与行处理',
    description: '检测并消除所有行共同持有的前导缩进空格',
    run: (t) => {
      const lines = t.split('\n');
      let minIndent: number | null = null;
      for (const line of lines) {
        if (!line.trim()) continue;
        const indent = line.match(/^\s*/)?.[0].length || 0;
        if (minIndent === null || indent < minIndent) minIndent = indent;
      }
      if (minIndent === null || minIndent === 0) return t;
      return lines.map((l) => l.slice(minIndent as number)).join('\n');
    },
  },
  {
    id: 'MergeBlankLines',
    name: '合并连续空行 (Merge Blank Lines)',
    category: 'lines',
    categoryLabel: '空格与行处理',
    description: '将连续多个空行合并为一个独立空行',
    run: (t) => t.replace(/\n\s*\n\s*\n/g, '\n\n'),
  },
  {
    id: 'SplitBySpace',
    name: '按空格分行 (Split by Space)',
    category: 'lines',
    categoryLabel: '空格与行处理',
    description: '把单行内由空格分隔的内容拆分成多行',
    run: (t) => t.split(/\s+/).filter(Boolean).join('\n'),
  },
  {
    id: 'SplitByComma',
    name: '按逗号分行 (Split by Comma)',
    category: 'lines',
    categoryLabel: '空格与行处理',
    description: '将逗号分隔的数据拆分为独立多行',
    run: (t) => t.split(',').map((s) => s.trim()).filter(Boolean).join('\n'),
  },
  {
    id: 'JoinLinesWith',
    name: '自定义分隔符合并多行 (Join Lines With...)',
    category: 'lines',
    categoryLabel: '空格与行处理',
    description: '将多行文本通过指定符号合并成单行',
    needsArg: true,
    argPlaceholder: '例如 , 或 | 或 空格',
    defaultArg: ', ',
    run: (t, arg = ', ') => t.replace(/\r?\n/g, arg),
  },
  {
    id: 'JoinLinesWithComma',
    name: '逗号合并多行 (Join with Comma)',
    category: 'lines',
    categoryLabel: '空格与行处理',
    description: '将多行文本以逗号快速拼接为一行',
    run: (t) => t.replace(/\r?\n/g, ', '),
  },

  // --- List & Filters ---
  {
    id: 'UniqueList',
    name: '行去重 (Unique Lines)',
    category: 'lines',
    categoryLabel: '列表与筛选',
    description: '消除文本中重复出现的行，保持唯一集合',
    run: (t) => Array.from(new Set(t.replace(/\n$/, '').split('\n'))).join('\n'),
  },
  {
    id: 'SortCharacter',
    name: '字符字母排序 (Sort Lines Alphabetical)',
    category: 'lines',
    categoryLabel: '列表与筛选',
    description: '对每行文本按字母顺序升序排序 (A-Z)',
    run: (t) =>
      t
        .replace(/\n$/, '')
        .split('\n')
        .sort((a, b) => a.localeCompare(b))
        .join('\n'),
  },
  {
    id: 'SortNumber',
    name: '数值大小排序 (Sort Lines Numerical)',
    category: 'lines',
    categoryLabel: '列表与筛选',
    description: '将每行转换为数值并从小到大排序',
    run: (t) =>
      t
        .replace(/\n$/, '')
        .split('\n')
        .sort((a, b) => Number(a) - Number(b))
        .join('\n'),
  },
  {
    id: 'ReverseList',
    name: '列表倒序 (Reverse Lines)',
    category: 'lines',
    categoryLabel: '列表与筛选',
    description: '将所有行的排列次序完全逆转',
    run: (t) => t.replace(/\n$/, '').split('\n').reverse().join('\n'),
  },
  {
    id: 'PickRows',
    name: '模循环按行提取 (Pick Rows i/n)',
    category: 'lines',
    categoryLabel: '列表与筛选',
    description: '提取第 i 行并按间隔 n 重复抽取，参数格式：1/2 (抽奇数行)',
    needsArg: true,
    argPlaceholder: '格式 i/n 如 1/2',
    defaultArg: '1/2',
    run: (t, arg = '1/2') => {
      const numbers = arg.match(/\d+/g)?.map(Number) || [];
      if (numbers.length < 2) return t;
      const row = numbers[0];
      const total = numbers[1];
      const lines = t.split('\n');
      return lines.filter((_, idx) => (idx + 1) % total === row % total).join('\n');
    },
  },
  {
    id: 'PickColumns',
    name: '提取指定列 (Pick Columns by Index)',
    category: 'lines',
    categoryLabel: '列表与筛选',
    description: '以空格分列并挑选指定列，参数格式：1,3 (第1列和第3列)',
    needsArg: true,
    argPlaceholder: '例如 1,3,5',
    defaultArg: '1',
    run: (t, arg = '1') => {
      const indices = arg.split(',').map((x) => Number(x.trim())).filter((n) => !isNaN(n));
      const lines = t.split('\n');
      return lines
        .map((line) => {
          const cols = line.trim().split(/\s+/);
          return indices.map((idx) => cols[idx - 1] || '').join(' ').trim();
        })
        .join('\n');
    },
  },

  // --- Encoding & Conversion ---
  {
    id: 'Base64Encode',
    name: 'Base64 编码 (Base64 Encode)',
    category: 'encoding',
    categoryLabel: '编解码与转换',
    description: '支持完整 UTF-8 中英文字符的标准 Base64 编码',
    run: (t) => base64Encode(t),
  },
  {
    id: 'Base64Decode',
    name: 'Base64 解码 (Base64 Decode)',
    category: 'encoding',
    categoryLabel: '编解码与转换',
    description: '还原 Base64 加密字符串至原始明文',
    run: (t) => base64Decode(t),
  },
  {
    id: 'URIEncode',
    name: 'URL 编码 (URI Encode)',
    category: 'encoding',
    categoryLabel: '编解码与转换',
    description: '将特殊符号转换为 %XX 的 URL 传输安全格式',
    run: (t) => encodeURIComponent(t),
  },
  {
    id: 'URIDecode',
    name: 'URL 解码 (URI Decode)',
    category: 'encoding',
    categoryLabel: '编解码与转换',
    description: '将 %XX 格式还原为原始字符',
    run: (t) => {
      try {
        return decodeURIComponent(t);
      } catch {
        return 'Invalid URI sequence';
      }
    },
  },
  {
    id: 'ToUnicode',
    name: '转 Unicode 转义 (To \\uXXXX)',
    category: 'encoding',
    categoryLabel: '编解码与转换',
    description: '将中英文转换为 \\uXXXX 格式',
    run: (t) =>
      [...t]
        .map((char) => {
          const hex = char.codePointAt(0)?.toString(16) || '';
          return '\\u' + hex.padStart(4, '0');
        })
        .join(''),
  },
  {
    id: 'FromUnicode',
    name: 'Unicode 还原 (From \\uXXXX)',
    category: 'encoding',
    categoryLabel: '编解码与转换',
    description: '将 \\uXXXX 还原为可读字符',
    run: (t) =>
      t.replace(/\\u([0-9a-fA-F]{4})/g, (_, hex) =>
        String.fromCharCode(parseInt(hex, 16))
      ),
  },
  {
    id: 'HexToRGB',
    name: '十六进制色转 RGB (Hex ➔ RGB)',
    category: 'encoding',
    categoryLabel: '编解码与转换',
    description: '输入 #3B82F6 转换为 rgb(59, 130, 246)',
    run: (t) => {
      const hex = t.replace('#', '').trim();
      if (hex.length !== 6 && hex.length !== 3) return 'Invalid Hex color';
      const r = parseInt(hex.length === 3 ? hex[0] + hex[0] : hex.slice(0, 2), 16);
      const g = parseInt(hex.length === 3 ? hex[1] + hex[1] : hex.slice(2, 4), 16);
      const b = parseInt(hex.length === 3 ? hex[2] + hex[2] : hex.slice(4, 6), 16);
      return `rgb(${r}, ${g}, ${b})`;
    },
  },
  {
    id: 'RGBToHex',
    name: 'RGB 转十六进制色 (RGB ➔ Hex)',
    category: 'encoding',
    categoryLabel: '编解码与转换',
    description: '输入 rgb(59, 130, 246) 转换为 #3B82F6',
    run: (t) => {
      const nums = t.match(/\d+/g)?.map(Number) || [];
      if (nums.length < 3) return 'Invalid RGB values';
      const toHex = (n: number) => Math.max(0, Math.min(255, n)).toString(16).padStart(2, '0');
      return `#${toHex(nums[0])}${toHex(nums[1])}${toHex(nums[2])}`.toUpperCase();
    },
  },

  // --- Data & Formatter ---
  {
    id: 'FormatJSON',
    name: '格式化 JSON (Prettify JSON)',
    category: 'data',
    categoryLabel: '数据与格式化',
    description: '缩进 2 空格美化 JSON 结构，方便审查与排错',
    run: (t) => {
      try {
        return JSON.stringify(JSON.parse(t), null, 2);
      } catch (e: any) {
        return 'JSON 解析错误: ' + e.message;
      }
    },
  },
  {
    id: 'MinifyJSON',
    name: '压缩 JSON (Minify JSON)',
    category: 'data',
    categoryLabel: '数据与格式化',
    description: '去除所有空白与换行，生成单行最小体积 JSON',
    run: (t) => {
      try {
        return JSON.stringify(JSON.parse(t));
      } catch (e: any) {
        return 'JSON 解析错误: ' + e.message;
      }
    },
  },
  {
    id: 'HTTPHeadersToJSON',
    name: '请求头转 JSON (Headers ➔ JSON)',
    category: 'data',
    categoryLabel: '数据与格式化',
    description: '将 Postman/Chrome 复制的冒号分隔 Headers 转为键值对象',
    run: (t) => httpHeadersToJSON(t),
  },
  {
    id: 'Stringify',
    name: '转为转义字符串 (Stringify)',
    category: 'data',
    categoryLabel: '数据与格式化',
    description: '将任意文本安全转义为带引号的单行代码字符串',
    run: (t) => JSON.stringify(t),
  },

  // --- SQL & Template ---
  {
    id: 'Template',
    name: '批量填充模板 (Template Engine)',
    category: 'sql',
    categoryLabel: '模板与 SQL 生成',
    description: '第一行写模板（$0=第1列, $1=第2列, $NO=行号），后续行作为数据',
    needsArg: true,
    argPlaceholder: '例如：INSERT INTO t VALUES (\'$0\', \'$1\');',
    defaultArg: 'Item $NO: $0 -> $1',
    run: (t, template = 'Item $NO: $0') => {
      const lines = t.split('\n');
      return lines
        .map((line, idx) => {
          const cols = line.trim().split(/\s+/);
          let res = template.replaceAll('$NO', String(idx + 1));
          for (let i = cols.length - 1; i >= 0; i--) {
            res = res.replaceAll(`$${i}`, cols[i]);
          }
          return res;
        })
        .join('\n');
    },
  },
  {
    id: 'SQLTableColumns',
    name: 'SQL 建表提取字段列表 (SQL Columns)',
    category: 'sql',
    categoryLabel: '模板与 SQL 生成',
    description: '解析 CREATE TABLE 语句，提取字段名与数据类型',
    run: (t) => {
      const { columns } = parseSqlColumns(t);
      if (!columns.length) return '未在输入中识别到有效的字段定义。请贴入 CREATE TABLE 语句。';
      return columns.map((c) => `${c.cleanType.padEnd(12)} ${c.name}${c.comment ? '  // ' + c.comment : ''}`).join('\n');
    },
  },
  {
    id: 'SQLToTSInterface',
    name: 'SQL 建表转 TypeScript Interface',
    category: 'sql',
    categoryLabel: '模板与 SQL 生成',
    description: '解析 SQL DDL 并生成严格对应的 TypeScript 类型接口',
    run: (t) => {
      const { tableName, columns } = parseSqlColumns(t);
      if (!columns.length) return '// 请贴入标准的 CREATE TABLE 语句';
      const entityName = toPascalCase(tableName);
      let out = `export interface ${entityName} {\n`;
      for (const col of columns) {
        const { ts } = mapSqlToTypes(col.cleanType);
        const camel = toCamelCase(col.name);
        if (col.comment) {
          out += `  /** ${col.comment} */\n`;
        }
        out += `  ${camel}: ${ts};\n`;
      }
      out += `}\n`;
      return out;
    },
  },
  {
    id: 'SQLToJavaBean',
    name: 'SQL 建表转 Java POJO / Bean',
    category: 'sql',
    categoryLabel: '模板与 SQL 生成',
    description: '解析 SQL DDL 并生成带有驼峰命名与注释的 Java 实体类',
    run: (t) => {
      const { tableName, columns } = parseSqlColumns(t);
      if (!columns.length) return '// 请贴入标准的 CREATE TABLE 语句';
      const entityName = toPascalCase(tableName);
      let out = `public class ${entityName} {\n`;
      for (const col of columns) {
        const { java } = mapSqlToTypes(col.cleanType);
        const camel = toCamelCase(col.name);
        if (col.comment) {
          out += `    // ${col.comment}\n`;
        }
        out += `    private ${java} ${camel};\n`;
      }
      out += `}\n`;
      return out;
    },
  },
  {
    id: 'SQLInClause',
    name: '多行转 SQL IN 条件语句 (SQL IN...)',
    category: 'sql',
    categoryLabel: '模板与 SQL 生成',
    description: '将逐行 ID 或字符串拼为 (\'a\', \'b\', \'c\') 供数据库查询',
    run: (t) => {
      const items = t
        .split(/[\r\n,]+/)
        .map((s) => s.trim())
        .filter(Boolean);
      if (!items.length) return '()';
      const formatted = items.map((i) => `'${i}'`).join(', ');
      return `IN (${formatted})`;
    },
  },

  // --- Geek & Script ---
  {
    id: 'RunJS',
    name: '即席执行 JS 脚本 (Eval JS)',
    category: 'geek',
    categoryLabel: '极客与调试',
    description: '在安全纯客户端沙箱中运行 JavaScript 代码并输出结果',
    run: (t) => {
      try {
        const clean = t.replace(/\n\n\/\/ Result:[\s\S]*$/, '');
        // eslint-disable-next-line no-eval
        const res = eval(clean);
        return typeof res === 'object' ? JSON.stringify(res, null, 2) : String(res);
      } catch (e: any) {
        return 'Execution Error: ' + e.message;
      }
    },
  },
  {
    id: 'Calculate',
    name: '公式计算器 (Expression Calculator)',
    category: 'geek',
    categoryLabel: '极客与调试',
    description: '计算数学表达式（支持 +, -, *, /, Math.pow 等）',
    run: (t) => {
      try {
        // eslint-disable-next-line no-eval
        const res = eval(t.trim());
        return String(res);
      } catch {
        return 'Invalid Math Expression';
      }
    },
  },
  {
    id: 'EditDistance',
    name: '双词编辑距离 (Levenshtein Distance)',
    category: 'geek',
    categoryLabel: '极客与调试',
    description: '计算前两行文本之间的最小编辑代价',
    run: (t) => {
      const lines = t.split('\n').filter(Boolean);
      if (lines.length < 2) return '需要两行不同的文本以计算编辑距离';
      const s1 = lines[0];
      const s2 = lines[1];
      const m = s1.length;
      const n = s2.length;
      const dp: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
      for (let i = 0; i <= m; i++) dp[i][0] = i;
      for (let j = 0; j <= n; j++) dp[0][j] = j;
      for (let i = 1; i <= m; i++) {
        for (let j = 1; j <= n; j++) {
          if (s1[i - 1] === s2[j - 1]) dp[i][j] = dp[i - 1][j - 1];
          else dp[i][j] = 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
        }
      }
      return `Levenshtein Edit Distance: ${dp[m][n]}`;
    },
  },
  {
    id: 'TimestampNow',
    name: '获取当前时间戳 (Current Timestamp)',
    category: 'geek',
    categoryLabel: '极客与调试',
    description: '获取当前的秒级 Unix Timestamp 与 ISO 时间',
    run: () => {
      const now = new Date();
      return `Timestamp (seconds): ${Math.floor(now.getTime() / 1000)}\nTimestamp (ms): ${now.getTime()}\nISO Time: ${now.toISOString()}\nLocal: ${now.toLocaleString()}`;
    },
  },
  {
    id: 'DateToTimestamp',
    name: '日期转时间戳 (Date ➔ Timestamp)',
    category: 'geek',
    categoryLabel: '极客与调试',
    description: '输入如 2026-10-31 17:00:00 转换为秒级时间戳',
    run: (t) => {
      const ts = Date.parse(t.trim());
      if (isNaN(ts)) return 'Invalid Date Format';
      return String(Math.floor(ts / 1000));
    },
  },
  {
    id: 'TimestampToISO',
    name: '时间戳转标准时间 (Timestamp ➔ ISO)',
    category: 'geek',
    categoryLabel: '极客与调试',
    description: '输入 1730365200 转换为 ISO 8601 与本地时间',
    run: (t) => {
      const num = Number(t.trim());
      if (isNaN(num)) return 'Invalid timestamp';
      const d = new Date(num > 1e11 ? num : num * 1000);
      return `ISO: ${d.toISOString()}\nLocal: ${d.toLocaleString()}`;
    },
  },
];

// 预设高频配方 (Recipes)
export const PRESET_RECIPES: Recipe[] = [
  {
    id: 'headers-to-json',
    name: 'HTTP Headers 转 JSON',
    description: '把浏览器或抓包工具复制的多行 Header 转换为标准 JSON 格式',
    tag: 'API 调试',
    sampleInput: `Host: api.bytegush.com\nUser-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)\nAuthorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9\nContent-Type: application/json\nAccept-Language: zh-CN,zh;q=0.9`,
    steps: [{ toolId: 'HTTPHeadersToJSON' }],
  },
  {
    id: 'sql-to-ts',
    name: 'SQL 建表转 TypeScript 实体',
    description: '将 MySQL / Postgres 建表语句一键转为强类型 TypeScript 接口',
    tag: '全栈出海',
    sampleInput: `CREATE TABLE \`user_profile\` (\n  \`id\` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '用户主键',\n  \`account_name\` varchar(64) NOT NULL COMMENT '登录账号',\n  \`email_address\` varchar(128) DEFAULT NULL COMMENT '联系邮箱',\n  \`balance_amount\` decimal(10,2) NOT NULL DEFAULT '0.00' COMMENT '账户余额',\n  \`is_active\` tinyint(1) NOT NULL DEFAULT '1' COMMENT '是否激活',\n  \`created_at\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '注册时间',\n  PRIMARY KEY (\`id\`)\n) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`,
    steps: [{ toolId: 'SQLToTSInterface' }],
  },
  {
    id: 'clean-dedup-in',
    name: '脏数据清洗 ➔ SQL IN 拼接',
    description: '清理冗余首尾空格、消除重复项，并组装为可以直接贴入 SQL 的 IN 列表',
    tag: '数据排查',
    sampleInput: `  user_001 \nuser_002\n  user_001\nuser_003  \nuser_002\n  user_004  `,
    steps: [
      { toolId: 'TrimSpace' },
      { toolId: 'UniqueList' },
      { toolId: 'SQLInClause' },
    ],
  },
  {
    id: 'camel-to-snake',
    name: '批量驼峰转下划线',
    description: '将多个前端 camelCase 变量名一键批量转换为数据库/后端下划线风格',
    tag: '代码重构',
    sampleInput: `userAccountId\nproductCategoryCode\norderShippingAddress\ncreatedTimestamp\nlastPaymentGatewayStatus`,
    steps: [{ toolId: 'HumpToUnderline' }],
  },
];

// Git & Vim 速查表数据
export const GIT_CHEAT_SHEET: CheatSheetItem[] = [
  { command: 'git config --global user.name "[name]"', explain: '设置提交全局作者名称' },
  { command: 'git config --global user.email "[email]"', explain: '设置提交全局关联邮箱' },
  { command: 'git diff', explain: '查看工作区与暂存区的差异代码' },
  { command: 'git diff --staged', explain: '查看暂存区与最后一次提交的差异' },
  { command: 'git log branchB..branchA', explain: '查看存在于 branchA 但不在 branchB 的提交' },
  { command: 'git show [SHA]', explain: '以详细格式查看指定的提交对象' },
  { command: 'git rebase [branch]', explain: '将当前分支的变动重演在指定分支之后' },
  { command: 'git reset --hard [commit]', explain: '彻底重置工作区和暂存区到指定提交（谨慎操作）' },
  { command: 'git clean -fxd', explain: '强制彻底删除未追踪的文件、目录与 .gitignore 忽略产物' },
];

export const VIM_CHEAT_SHEET: CheatSheetItem[] = [
  { command: '%', explain: '跳转到当前配对的括号、中括号或大括号' },
  { command: '* / #', explain: '快速向后 / 向前精确查找光标下的当前单词' },
  { command: 'gg / G', explain: '快速跳转到文件第一行 / 最后一行' },
  { command: ':20', explain: '精确跳转到第 20 行' },
  { command: ':1,2t.', explain: '快速复制第 1~2 行到当前光标所在行' },
  { command: '0 / ^ / $', explain: '跳转至行首 / 行首首个非空字符 / 行尾' },
  { command: 'I / A', explain: '在行首第一个非空字符处插入 / 在行末插入' },
  { command: 'u / Ctrl+R', explain: '撤销上一步操作 / 重做刚才撤销的操作' },
  { command: 'C / D', explain: '修改当前光标到行尾的所有内容 / 删除到行尾' },
  { command: 'cw / c4w', explain: '修改一个词 / 修改后方 4 个词' },
  { command: '4x', explain: '快速删除光标后方的 4 个字符' },
];

export const SHELL_CHEAT_SHEET: CheatSheetItem[] = [
  { command: 'lsof -i :<port>', explain: '查看指定端口被哪个进程占用并获取 PID' },
  { command: 'kill -9 <PID>', explain: '强制杀掉指定 PID 的进程' },
  { command: 'tar -zxvf archive.tar.gz', explain: '解压 tar.gz 压缩包至当前目录' },
  { command: 'grep -rn "pattern" ./', explain: '在当前目录下递归检索关键词并显示行号' },
  { command: 'df -h', explain: '以可读单位 (GB/MB) 查看磁盘挂载分区空间' },
  { command: 'du -sh *', explain: '统计当前目录下各子文件/文件夹的实际大小' },
  { command: 'tail -f -n 100 app.log', explain: '实时持续滚动查看日志文件后 100 行' },
  { command: 'chmod +x script.sh', explain: '赋予脚本可执行权限' },
  { command: 'curl -I https://example.com', explain: '仅获取远程 URL 的 HTTP 响应头信息' },
];

export const DOCKER_CHEAT_SHEET: CheatSheetItem[] = [
  { command: 'docker ps -a', explain: '查看本机所有容器（含已退出的容器）' },
  { command: 'docker logs -f --tail 100 <container>', explain: '实时持续跟踪查看容器最新日志' },
  { command: 'docker exec -it <container> /bin/sh', explain: '以交互式模式进入容器内部终端' },
  { command: 'docker compose up -d --build', explain: '重新构建镜像并在后台守护运行所有服务' },
  { command: 'docker system prune -a --volumes', explain: '一键深度清理无用镜像、容器与数据卷缓存' },
  { command: 'docker stop $(docker ps -q)', explain: '一键优雅停止当前所有正在运行的容器' },
];

export const ALL_CHEAT_SHEETS: CheatSheetCategory[] = [
  {
    id: 'git',
    name: 'Git 版本控制',
    badge: '版本管理',
    items: GIT_CHEAT_SHEET,
  },
  {
    id: 'vim',
    name: 'Vim 快捷键',
    badge: '终端编辑',
    items: VIM_CHEAT_SHEET,
  },
  {
    id: 'shell',
    name: 'Linux / Shell 必备',
    badge: '系统运维',
    items: SHELL_CHEAT_SHEET,
  },
  {
    id: 'docker',
    name: 'Docker 常用命令',
    badge: '容器化',
    items: DOCKER_CHEAT_SHEET,
  },
];
