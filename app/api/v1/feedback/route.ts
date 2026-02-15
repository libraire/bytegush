

export const dynamic = "force-dynamic"; // defaults to auto
export async function POST(request: Request) {

    const body = await request.json();
    const response = await fetch(process.env.NEXT_PUBLIC_API_HOST + "/api/v1/feedback", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ app: body.app || 'bytegush', body: body.body }),
    })

    if (response.ok) {
        return Response.json({ success: true });
    } else {
        return Response.json({ success: false, error: 'Failed to send feedback' }, { status: 500 });
    }
}
