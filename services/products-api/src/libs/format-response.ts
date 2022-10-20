export const formatJSONResponse = (response: unknown) => {
  return {
    statusCode: 200,
    body: JSON.stringify(response),
  };
};
