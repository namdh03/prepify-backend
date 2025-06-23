import { DataSourceOptions } from 'typeorm';
import envConfig from './env.config';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { ENVIROMENT } from '~constants/env.constant';

const TYPEORM_CONFIG: DataSourceOptions = {
	type: 'mariadb',
	host: envConfig.MARIADB_HOST,
	// port: envConfig.MARIADB_PORT,
	username: envConfig.MARIADB_USER,
	password: envConfig.MARIADB_PASSWORD,
	database: envConfig.MARIADB_DATABASE,
	entities: [__dirname + '/../**/*.entity.{js,ts}'],
	synchronize: false, //warning its will - with db - if y delete entity - db will delete it
	logging: envConfig.ENVIROMENT == ENVIROMENT.DEVELOPMENT,
	namingStrategy: new SnakeNamingStrategy()
};

export default {
	TYPEORM_CONFIG
};
