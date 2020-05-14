/*
 * Unless explicitly stated otherwise all files in this repository are licensed
 * under the Apache License Version 2.0.
 *
 * This product includes software developed at Datadog (https://www.datadoghq.com/).
 * Copyright 2019 Datadog, Inc.
 */

import { TracingMode, optionsTemplate } from "./common";

export function es6Template(filePath: string, methods: string[], mode: TracingMode) {
  const methodsString = methodsTemplate(methods, mode);
  const tracerString = tracerTemplate(mode);
  return `/* eslint-disable */
${tracerString}
const { datadog } = require("datadog-lambda-js");
import * as original from "../${filePath}";
${methodsString}`;
}
function tracerTemplate(mode: TracingMode): string {
  switch (mode) {
    case TracingMode.DD_TRACE:
    case TracingMode.HYBRID:
      return 'require("dd-trace").init();';
    case TracingMode.XRAY:
    case TracingMode.NONE:
      return "";
  }
}

function methodsTemplate(methods: string[], tracingMode: TracingMode) {
  const optionsStr = optionsTemplate(tracingMode);
  let data = "";
  for (const method of methods) {
    data += "\n";
    data += `export const ${method} = datadog(original.${method},${optionsStr});`;
  }
  return data;
}