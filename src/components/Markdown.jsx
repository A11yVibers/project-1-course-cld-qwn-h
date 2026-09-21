import { useMemo } from 'react'
import { marked } from 'marked'

marked.setOptions({ gfm: true, breaks: false })

/**
 * Renders Markdown source (e.g. assignment instructions imported from
 * project-assets/materials/) as HTML. The source content is trusted project
 * data, parsed with GitHub-flavored Markdown (tables, lists, emphasis).
 */
export default function Markdown({ text }) {
  const html = useMemo(() => marked.parse(text ?? ''), [text])
  return <div className="markdown" dangerouslySetInnerHTML={{ __html: html }} />
}
