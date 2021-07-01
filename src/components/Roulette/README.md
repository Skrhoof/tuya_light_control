# 轮盘转动组件

![轮盘转动组件](./show.png '轮盘转动组件')

## 组件使用注意点

使用组件所在的页面必须隐藏默认的 `TopBar`，即在 main.js 文件中设置当前页面`hideTopbar: true`

## 导入

```javascript
import Roulette from '../../components/Roulette';
```

## Props

```javascript
    outerDiameter: PropTypes.number, // 容器直径
    innerDiameter: PropTypes.number, // 圆直径
    trackHeight: PropTypes.number, // 轨道高度
    onStart: PropTypes.func, // 开始转动
    onMove: PropTypes.func, // 转动中
    onEnd: PropTypes.func, // 转动结束
    text: PropTypes.string, // 文本
    textSize: PropTypes.number, // 文本尺寸大小
    textColor: PropTypes.string, // 文本颜色
    containerStyle: ViewPropTypes.style, // 容器样式
    innerStyle: ViewPropTypes.style, // 圆样式
```

## Use

```javascript
        // 示例1
        <Roulette />
        // 示例2
        <Roulette
          outerDiameter={500}
          innerDiameter={463}
          trackHeight={20}
          onStart={angle => {
            console.log(angle);
          }}
          onMove={angle => {
            console.log(angle);
          }}
          onEnd={angle => {
            console.log(angle);
          }}
          text="START"
          textSize={30}
          textColor="#fff"
          containerStyle={styles.containerStyle}
          innerStyle={styles.innerStyle}
        />
        // ...
        const styles = StyleSheet.create({
          containerStyle: {
            marginLeft: -550,
          },
          innerStyle: {
            backgroundColor: 'pink',
          },
        });
```
