import { getConnection, createConnection, Connection } from 'typeorm';

export class DatabaseConnection {
  private static _connection: Connection;

  static getConnection(): Connection {
    let connection = getConnection();

    if (connection) {
      return DatabaseConnection._connection;
    } else {
      throw new Error(
        'Erro ao tentar estabalecer conexão com a database, tente novamente mais tarde.'
      );
    }
  }

  static async initConnection() {
    if (!DatabaseConnection._connection) this._connection = await createConnection();
  }

  static async closeConnection() {
    if (this._connection) await this._connection.close();
  }
}
