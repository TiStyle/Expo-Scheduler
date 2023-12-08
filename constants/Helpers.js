import { Platform } from 'react-native';

const S4 = () => {
	return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
};

export default {
	getUniqueGuid: () => {
		const deviceType = Platform.OS === 'ios' ? 'AP' : 'AN';
		const guid = (S4() + S4() + '-' + S4() + '-4' + S4().substr(0, 3) + '-' + S4() + '-' + S4() + S4() + S4()).toLowerCase().replace(/^.{2}/g, deviceType);

		return guid;
	},
};
