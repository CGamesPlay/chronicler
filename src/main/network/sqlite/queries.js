// @flow
import SQL from "sql-template-strings";

export const insertRequest = (
  url: string,
  method: string,
  headerJson: string,
  body: ?Buffer,
) => SQL`
INSERT INTO requests ( url, method, headers, body )
VALUES ( ${url}, ${method}, ${headerJson}, ${body} )`;

export const insertResponse = (
  requestId: number,
  statusCode: number,
  headerJson: string,
  body: ?Buffer,
) => SQL`
INSERT INTO responses ( requestId, statusCode, headers, body )
VALUES ( ${requestId}, ${statusCode}, ${headerJson}, ${body} )`;

export const deleteRequest = (id: number) =>
  SQL`DELETE FROM requests WHERE id = ${id}`;

export const findReplay = (url: string, method: string) =>
  SQL`
SELECT url, method, requests.headers AS requestHeaders, requests.body AS requestBody,
statusCode, responses.headers as responseHeaders, responses.body AS responseBody
FROM requests
LEFT JOIN responses
ON responses.requestId = requests.id
WHERE url = ${url}
AND method = ${method}
AND statusCode != 304
ORDER BY requests.id DESC
LIMIT 1
`;
