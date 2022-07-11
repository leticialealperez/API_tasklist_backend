import config from './jest.config';

let configUnit: any = {
  ...config,
  testMatch: ['**/*.spec.ts'],
};

export default configUnit;
