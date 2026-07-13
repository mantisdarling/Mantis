import { NodeSDK } from '@opentelemetry/sdk-node';
import { PrometheusExporter } from '@opentelemetry/exporter-prometheus';

const exporter = new PrometheusExporter({ port: 9464 });

const sdk = new NodeSDK({
  metricReader: exporter,
});

try {
  sdk.start();
  console.log('OpenTelemetry SDK started successfully');
} catch (error) {
  console.error('Error starting OpenTelemetry SDK', error);
}
