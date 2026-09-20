import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { env } from '../../config/env';

const execFileAsync = promisify(execFile);

export interface DatabaseRow {
  [column: string]: string | null;
}

export class DatabaseClient {
  private readonly dockerImage =
    'eclipse-temurin:21-jdk';

  public async query(
    sql: string
  ): Promise<DatabaseRow[]> {
    const dockerArguments = [
      'run',
      '--rm',
      '--network',
      'container:parabank',
      '-e',
      'DB_HOST=localhost',
      '-e',
      `DB_PORT=${env.dbPort}`,
      '-e',
      `DB_NAME=${env.dbName}`,
      '-e',
      `DB_USER=${env.dbUser}`,
      '-e',
      `DB_PASSWORD=${env.dbPassword}`,
      '-v',
      `${process.cwd()}/database/clients/jdbc:/work`,
      this.dockerImage,
      'java',
      '-cp',
      '/work/hsqldb-2.7.4.jar',
      '/work/HsqlDbClient.java',
      sql
    ];

    const { stdout, stderr } = await execFileAsync(
      'docker',
      dockerArguments
    );

    if (stderr.trim()) {
      throw new Error(
        `Database query failed: ${stderr.trim()}`
      );
    }

    return this.parseOutput(stdout);
  }

  private parseOutput(
    output: string
  ): DatabaseRow[] {
    const lines = output
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean);

    if (!lines.includes('DB_CONNECTION=SUCCESS')) {
      throw new Error(
        `Database connection was not successful. Output: ${output}`
      );
    }

    return lines
      .filter((line) => line !== 'DB_CONNECTION=SUCCESS')
      .map((line) => this.parseRow(line));
  }

  private parseRow(
    row: string
  ): DatabaseRow {
    const columns = row.split(' | ');

    return Object.fromEntries(
      columns.map((column) => {
        const separatorIndex = column.indexOf('=');

        if (separatorIndex === -1) {
          throw new Error(
            `Invalid database row format: ${row}`
          );
        }

        const key = column.slice(0, separatorIndex);
        const value = column.slice(separatorIndex + 1);

        return [
          key,
          value === 'null' ? null : value
        ];
      })
    );
  }
}