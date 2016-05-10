
import path from 'path'
import fs from 'fs'
import cheerio from 'cheerio'

const extract = email =>
  cheerio.load(email)('mjml mj-body mj-container').html()

const includeRegex = /<mj-include\s+from=['"](.*)['"]\s+\/>/g

const getName = p => path.basename(p).replace(/\.mjml$/, '')

export default (email, includes) => {
  const templates = includes.reduce((p, c) =>
    ({ ...p, [getName(c)]: extract(fs.readFileSync(c)) }), {})

  return email.replace(includeRegex, (_, name) => templates[name])
}
