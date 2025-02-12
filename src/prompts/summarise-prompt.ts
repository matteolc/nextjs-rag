export default `
Generate a self-contained summary of the following document that would be useful for retrieval in a RAG system. The summary should:

- Preserve key facts, figures, and specific details that might be queried later
- Include relevant context without relying on the original document
- Maintain important technical terms and proper nouns exactly as they appear
- Be information-dense while removing redundancy
- Include explicit relationships between concepts to aid semantic search

Format the summary as a single coherent paragraph without line breaks to optimize for vector embedding.
Here is the document to summarize:
{text}`;
