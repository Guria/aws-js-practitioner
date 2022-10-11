// Serverless plugin that outputs value from outputs based on templates in custom config
class LogOutputValues {
  constructor(serverless, options) {
    this.serverless = serverless;
    this.options = options;

    this.hooks = {
      "after:deploy:deploy": this.logOutputValues.bind(this),
    };
  }

  async logOutputValues() {
    const result = await this.getResults();
    const outputsList = this.serverless.service.custom["log-output-values"];

    const replacements = {};
    outputsList.forEach(({ template }) => {
      const outputValue = template.replace(/{(\w+)}/g, (token, outputName) => {
        if (!replacements[outputName]) {
          replacements[outputName] = this.getOutputValue(result, outputName);
        }

        return replacements[outputName] || token;
      });

      this.serverless.cli.log(outputValue);
    });
  }

  async getResults() {
    const provider = this.serverless.getProvider("aws");
    const stackName = provider.naming.getStackName(this.options.stage);

    return await provider.request(
      "CloudFormation",
      "describeStacks",
      { StackName: stackName },
      this.options.stage,
      this.options.region
    );
  }

  getOutputValue(result, outputKey) {
    const output = result.Stacks[0].Outputs.find(
      (o) => o.OutputKey === outputKey
    );
    return output.OutputValue;
  }
}

module.exports = LogOutputValues;
