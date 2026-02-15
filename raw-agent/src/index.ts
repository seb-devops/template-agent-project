import { Hono } from 'hono'
import { z } from 'zod'
import { validator } from 'hono/validator'

const serveSchema = z.object({
   query: z.string(),
})
const app = new Hono()


// this endpoint will serve an ai agent that can be u
app.post('/serve', validator(
  "json", (value, c) => {
    return serveSchema.parse(value)
  }), (c) => {
    const { query } = c.req.valid('json') as z.infer<typeof serveSchema>;
    const agent = new Agent(query);
    return c.text('Agent served successfully')
  })

export default app
