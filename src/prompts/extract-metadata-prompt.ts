export default `
Extract the following metadata from the document content. Extract the metadata in the following JSON format:

{format_instructions}

Ensure all fields are populated based on available information. If a field cannot be determined, use 'unknown'.
Document to analyze:
{text}
`;
