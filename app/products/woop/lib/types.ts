export type ToolCategory =
  | 'text'
  | 'case'
  | 'lines'
  | 'data'
  | 'encoding'
  | 'sql'
  | 'geek'
  | 'cheat';

export interface ToolDefinition {
  id: string;
  name: string;
  category: ToolCategory;
  categoryLabel: string;
  description: string;
  needsArg?: boolean;
  argPlaceholder?: string;
  defaultArg?: string;
  hotkey?: string;
  icon?: string;
  run: (input: string, arg?: string) => string;
}

export interface PipelineStep {
  id: string;
  toolId: string;
  arg?: string;
}

export interface Recipe {
  id: string;
  name: string;
  description: string;
  tag: string;
  sampleInput: string;
  steps: Array<{
    toolId: string;
    arg?: string;
  }>;
}

export interface CheatSheetItem {
  command: string;
  explain: string;
}

export interface CheatSheetCategory {
  id: string;
  name: string;
  badge: string;
  items: CheatSheetItem[];
}
