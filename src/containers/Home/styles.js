import { StyleSheet } from 'react-native';
import { convertX } from '../../utils';

export default StyleSheet.create({
    topstyle: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: convertX(10),
        marginBottom: convertX(20),
    },
    switchstyle: {
        width: convertX(375),
        height: convertX(150),
        backgroundColor: '#212B4C',
    },
    switchIcon: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        margin: convertX(30),
    },
    timerstyle: {
        height: convertX(28),
        width: convertX(104),
        backgroundColor: '#fff',
        borderRadius: convertX(14),
        justifyContent: 'center',
        alignItems: 'center',
        bottom: convertX(35)
    },
})