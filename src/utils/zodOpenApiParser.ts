import { ParameterObject } from '@/types/openapi.type';

interface zodParserType {
  _def: {
    innerType?: zodParserType;
    values?: Record<string, string>;
    checks?: {
      kind: string;
      value?: any;
      inclusive?: boolean;
    }[];
    coerce?: boolean;
    typeName: string;
  };
}
function parseType(type: string) {
  const map: Record<string, string> = {
    ZodString: 'string',
    ZodNumber: 'number',
    ZodNativeEnum: 'enum',
  };
  return map[type];
}
export function parseZodObject(paramType: string, name: string, obj: zodParserType) {
  const required = obj._def.typeName !== 'ZodOptional';
  const type =
    obj._def.typeName === 'ZodOptional' && obj._def.innerType
      ? parseType(obj._def.innerType._def.typeName)
      : parseType(obj._def.typeName);
  const val: ParameterObject = {
    name,
    in: paramType,
    required,
    schema: {
      type: type === 'enum' ? 'string' : type,
    },
  };

  let enums: string[] | undefined = undefined;
  if (type === 'enum') {
    if (obj._def.values) {
      enums = Object.values(obj._def.values);
    } else if (obj._def.innerType?._def.values) {
      enums = Object.values(obj._def.innerType._def.values);
    }
  }
  if (enums && val.schema && 'enum' in val.schema) val.schema.enum = enums;

  let format = undefined;

  if (obj._def.checks) {
    format = obj._def.checks[0]?.kind;
  } else if (obj._def.innerType?._def.checks) {
    format = obj._def.innerType._def.checks[0]?.kind;
  }

  if (format && val.schema && 'format' in val.schema) val.schema.format = format;

  return val;
}
