import config from './jest.config';

let configIntegration: any = {
  ...config,
  testMatch: ['**/*.test.ts'],
};

export default configIntegration;
