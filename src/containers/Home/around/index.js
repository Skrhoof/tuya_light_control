import React, { Component } from 'react'
import { View, Text, Image, ScrollView, TouchableOpacity } from 'react-native';
import axios from 'axios'
import TopBar from '../../../components/TopBar';
import BottomBar from '../../../components/BottomBar';
import { convertX } from '../../../utils';

export default class Around extends Component {

  state = {
    isWhite: true,
    dataList: [
      {
        pcode: "330000",
        biz_ext: {
          cost: [],
          rating: "4.3"
        },
        recommend: "0",
        type: "公司企业;公司;公司",
        photos: [
          {
            title: [],
            url: "http://store.is.autonavi.com/showpic/4371182ab50c81f7641c80223b85927f"
          }
        ],
        discount_num: "0",
        gridcode: "4519358602",
        typecode: "170200",
        shopinfo: "0",
        poiweight: [],
        citycode: "0571",
        adname: "临安区",
        children: [],
        alias: [],
        tel: [],
        id: "B023B19WI9",
        tag: [],
        event: [],
        entr_location: "119.711718,30.318035",
        indoor_map: "0",
        email: [],
        timestamp: "2022-03-15 12:49:01",
        address: "高后线附近",
        adcode: "330112",
        pname: "浙江省",
        cityname: "杭州市",
        match: "0",
        name: "全宇照明",
        groupbuy_num: "0"
      }
    ]
  }

  componentDidMount() {
    axios.get('https://restapi.amap.com/v3/place/text',
      {
        params: {
          key: '35f9b93e22da80fb9105e71b329ce0f2',
          keywords: '灯具',
          city: '杭州',
          children: 1,
          offset: 20,
          page: 1,
          extensions: 'all'
        }
      }).then(response => {
        console.log(response.data);
        this.setState({ dataList: response.data.pois });
      }, error => {
        console.log(error);
      })
  }

  render() {
    const { isWhite, dataList } = this.state
    return (
      <View style={
        {
          flex: 1, backgroundColor: '#fff',
        }}>
        <TopBar isWhite={isWhite} />
        <ScrollView>
          {dataList.map((item, index) => {
            return (
              <View style={{ padding: convertX(10), flexDirection: 'row', backgroundColor: 'rgba(156, 222, 256,0.5)', marginVertical: convertX(5) }}>
                <View style={{ flex: 1 }}>
                  <Image source={{ uri: item.photos[0].url }} style={{ width: convertX(80), height: convertX(80), borderRadius: 10 }} />
                </View>
                <View style={{ justifyContent: 'space-between', marginLeft: convertX(20), flex: 4 }}>
                  <Text style={{ fontSize: 19, fontWeight: 'bold' }}>{item.name}</Text>
                  <Text style={{ fontSize: 12 }}>{item.type}</Text>
                  <Text style={{ fontSize: 13 }}>
                    {`${item.pname} ${item.cityname} ${item.adname} ${item.address}`}
                  </Text>
                </View>
              </View>
            )
          })}
        </ScrollView>
        <BottomBar isWhite={isWhite} navigator={this.props.navigator} />
      </View>
    )
  }
}
