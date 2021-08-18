# 使用说明

``` javascript
<TempPicker
width={convertX(281)}
height={convertX(281)}
hasInner={true}
disabled={disabled ? disabled2 : disabled3}
offsetAngle={90}
reversal={true}
innerElement={
    <TouchableOpacity style={{
        width: convertX(84),
        height: convertX(84),
        backgroundColor: '#3F4C7A',
        borderRadius: convertX(50),
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 99,
    }}
    >
    </TouchableOpacity>
    }
innerRadius={convertX(35)}
temp_value={temp_value}
min={0}
max={1000}
onComplete={onTempChange && onTempChange} 
/>
```