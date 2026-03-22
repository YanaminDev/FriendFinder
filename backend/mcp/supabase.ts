import "dotenv/config"

const supabaseMCP = {
  type: "url",
  url: `https://mcp.supabase.com/mcp?project_ref=${process.env.SUPABASE_PROJECT_REF}`,
  name: "supabase",
  authorization_token: process.env.SUPABASE_ACCESS_TOKEN, 
}

export default supabaseMCP