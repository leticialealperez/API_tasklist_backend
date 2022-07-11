import { DomainError } from '../../../../core/domain/errors/domain-error';

export class NotAuthorizedError extends DomainError {
  constructor(erro: Error) {
    super(`Não autorizado.`, 401);
    this.name = 'NotAuthorizedError';
    erro;
  }
}
