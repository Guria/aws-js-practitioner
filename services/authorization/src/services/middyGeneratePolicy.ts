function generatePolicy(
  principalId: string,
  methodArn: string,
  allowed: boolean
) {
  return {
    principalId,
    policyDocument: {
      Version: "2012-10-17",
      Statement: [
        {
          Action: "execute-api:Invoke",
          Effect: allowed ? "Allow" : "Deny",
          Resource: methodArn,
        },
      ],
    },
  };
}

export const middyGeneratePolicy = {
  after: (request) => {
    return generatePolicy("user", request.event.methodArn, request.response);
  },
};
