import 'dotenv/config';
import { App, LogLevel, ExpressReceiver } from '@slack/bolt';
import getRequiredEnvVar from './utils/getRequiredEnvVar';
import api from './api';

export const receiver = new ExpressReceiver({ signingSecret: getRequiredEnvVar('SLACK_SIGNING_SECRET') });
let logLevel: LogLevel;
if (process.env.SLACK_LOG_LEVEL) {
  logLevel = process.env.SLACK_LOG_LEVEL as LogLevel;
} else {
  logLevel = process.env.NODE_ENV === 'development' ? LogLevel.DEBUG : LogLevel.INFO;
}

export const app = new App({
  receiver,
  logLevel,
  token: getRequiredEnvVar('SLACK_TOKEN'),
});

receiver.app.use('/api', api);

receiver.app.get('/', (_req, res) => {
  res.sendStatus(200);
});

// Generic catch all for unknown routes
receiver.app.use('*', (_req, res) => {
  res.sendStatus(404);
});

// NOTE: Uncomment the following if you want to use the webclient with ease
// Initialize the WebClient for future use
// app.client = new WebClient(getRequiredEnvVar('SLACK_BOT_TOKEN'));

// Register Listeners
// TODO: Add listeners

export const init = async (): Promise<void> => {
  // Do any async init stuff
};
