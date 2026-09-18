import Ajv, { JSONSchemaType, ValidateFunction } from 'ajv';

export class SchemaValidator {
  private readonly ajv: Ajv;

  public constructor() {
    this.ajv = new Ajv({
      allErrors: true,
      strict: true
    });
  }

  public compile<T>(
    schema: JSONSchemaType<T>
  ): ValidateFunction<T> {
    return this.ajv.compile<T>(schema);
  }

  public assertValid<T>(
    schema: JSONSchemaType<T>,
    data: unknown
  ): asserts data is T {
    const validate = this.compile(schema);

    if (!validate(data)) {
      const errors = validate.errors
        ?.map(
          (error) =>
            `${error.instancePath || '/'} ${error.message ?? 'validation error'}`
        )
        .join('; ');

      throw new Error(
        `JSON schema validation failed: ${errors ?? 'unknown validation error'}`
      );
    }
  }
}