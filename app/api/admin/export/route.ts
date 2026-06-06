export async function GET() {
  try {
    // In a real app, you'd fetch from a database
    // For now, we'll return a template structure
    const responses = [
      {
        id: '1',
        keywords: ['password', 'reset', 'forgot'],
        response:
          'To reset your password, click on Forgot Password on the login page and follow the instructions sent to your email.',
        category: 'password',
        createdAt: Date.now(),
        updatedAt: Date.now(),
      },
      {
        id: '2',
        keywords: ['billing', 'invoice', 'payment'],
        response:
          'Your invoice is automatically emailed after each billing cycle. You can download all past invoices from your account settings.',
        category: 'billing',
        createdAt: Date.now(),
        updatedAt: Date.now(),
      },
    ];

    return Response.json(responses);
  } catch (error) {
    return Response.json({ error: 'Failed to export' }, { status: 500 });
  }
}
