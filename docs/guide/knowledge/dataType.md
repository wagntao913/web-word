# :mailbox_with_mail: 数据类型
## :dart: 基本数据类型相关
- String      基本类型
- Number      基本类型
- Boolean     基本类型
- Symbol      基本类型
- Null        基本类型
- Undefined   基本类型
- BigInt      基本类型
- Object      引用类型
:::tip
- object常见的类型：Array、Math、Date、Function
- BigInt 谷歌64版本推出
:::

## :dart: 基础数据类型

- 基础类型：存储在 **栈内存**， 被引用或者被拷贝时，创建一个完全相等的变量

- 引用类型：存储在 **堆内存**， 存储的是地址，多个引用指向同一个地址

## :busstop:  数据类型检测

- **typeOf**：数据类型为 null或者是Object类型(除Function外)检测结果有问题
```js
    typeOf 'str'                // string
    typeOf 1                    // number
    typeOf undefined            // undefined
    typeOf true                 // boolean
    typeOf Sybmol()             // symbol
    typeOf null                 // object
    typeOf {}                   // object
    typeOf []                   // object
    typeOf function test () {}  // function
```
- **instanceof**：可以准确地判断复杂引用数据类型，但是不能正确判断基础数据类型
```js
    let str = New String('string')
    str instanceof String // true
    let str = '12312332'
    str instanceof String // false
```
- **Object.prototype.toString**：对于 Object 对象，直接调用 toString() 就能返回 [object Object]；而对于其他对象，则需要通过 call 来调用，才能返回正确的类型信息。 

```js
    Object.prototype.toString({})               // [object Object]
    Object.prototype.toString.call('string')    // [object String]
    Object.prototype.toString.call(123456)      // [object Number]
    Object.prototype.toString.call(true)        // [object Boolean]
    Object.prototype.toString.call(null)        // [object Null]
    Object.prototype.toString.call(undefined)   // [object Undefined]
    Object.prototype.toString.call([])          // [object Array]
    Object.prototype.toString.call(/123/g)      // [object RegExp]
    Object.prototype.toString.call(new Date())  // [object Date]
    Object.prototype.toString.call(() => {})    // [object Function]
    object.prototype.toString.call(window)      // [object Window]
    Object.prototype.toString.call(document)    // [object HTMLDocument]
```
## :busstop: 数据类型转换
- **强制类型转换**  

    Number()、parseInt()、parseFloat()、toString()、String()、Boolean()
- **隐式类型转换**
    1. 如果类型相同，无进行类型转换
    2. 如果其中一个操作值是 null 或者 undefined，那么另一个操作符必须为 null 或者 undefined，才会返回 true，否则都返回 false
    3. 如果其中一个是 Symbol 类型，那么返回 false
    4. 两个操作值如果为 string 和 number 类型，那么就会将字符串转换为 number
    5. 如果一个操作值是 boolean，那么转换成 number
    6. 如果一个操作值为 object 且另一方为 string、number 或者 symbol，就会把 object 转为原始类型再进行判断（调用 object 的 valueOf/toString 方法进行转换）
- **'+'的隐式转换**
    1. 如果其中有一个是字符串，另外一个是 undefined、null 或布尔型，则调用 toString() 方法进行字符串拼接；如果是纯对象、数组、正则等，则默认调用对象的转换方法会存在优先级（下一讲会专门介绍），然后再进行拼接。
    2. 如果其中有一个是数字，另外一个是 undefined、null、布尔型或数字，则会将其转换成数字进行加法运算，对象的情况还是参考上一条规则。
    3. 如果其中一个是字符串、一个是数字，则按照字符串规则进行拼接。
## :busstop: 浅拷贝 && 深拷贝
- **浅拷贝**：自己创建一个新的对象，来接受你要重新复制或引用的对象值。如果对象属性是基本的数据类型，复制的就是基本类型的值给新对象；但如果属性是引用数据类型，复制的就是内存中的地址，如果其中一个对象改变了这个内存中的地址，肯定会影响到另一个对象。  
    `浅拷贝的限制所在 -- 它只能拷贝一层对象。如果存在对象的嵌套，那么浅拷贝将无能为力`  
    1. **Object.assign(traget,...source)** 该方法的第一个参数是拷贝的目标对象，后面的参数是拷贝的来源对象（也可以是多个来源）
        - 它不会拷贝对象的继承属性
        - 它不会拷贝对象的不可枚举的属性
        - 可以拷贝 Symbol 类型的属性
    2. **扩展运算符 let cloneObj = { ...obj }** 如果属性都是基本类型的值，使用扩展运算符进行浅拷贝会更加方便
    3. **concat 拷贝数组**
- **深拷贝**：将一个对象从内存中完整地拷贝出来一份给目标对象，并从堆内存中开辟一个全新的空间存放新对象，且新对象的修改并不会改变原对象，二者实现真正的分离
    1. **JSON.stringify() && JSON.parse()**
    2. 手写深拷贝 
        - 遍历对象的不可枚举属性以及 Symbol 类型，我们可以使用 Reflect.ownKeys 方法
        - 利用 Object 的 getOwnPropertyDescriptors 方法可以获得对象的所有属性，以及对应的特性，顺便结合 Object 的 create 方法创建一个新对象，并继承传入原对象的原型链
    ```js
    const isComplexDataType = (obj) => (typeOf obj === 'object' || typeOf obj === 'function') && (obj !== null)
    const deepClone = (obj, hash= new WeakMap()) => {
        <!-- 如果是日期对象直接创建一个新的日期对象返回 -->
        if(obj.constructor === Date) return new Date(obj)
        <!-- 如果是正则对象，直接创建一个新的正则对象返回 -->
        if (obj.constructor === RegExp) return new RegExp(obj)
        <!-- 如果是循环引用，使用WeakMap处理 -->
        if(hash.has(obj)) return hash.get(obj)
        <!-- 获取对象的所有属性 -->
        let allDesc = Object.getOwnPropertyDescriptors(obj)
        <!-- 创建一个新对象 -->
        let cloneObj = Object.create(Object.getPrototypeOf(obj),allDesc)
        <!-- WeakMap 处理循环引用 -->
        hash.set(obj,cloneObj)
        <!-- 遍历不可枚举属性&&Symbol类型 -->
        for(let ket of Reflect.ownKeys(obj)){
            cloneObj[key] = (isComplexDataType(obj[key]) && typeOf obj[key] !== 'function') ? deepClone(obj[key]) : obj[key]
        }
        return cloneObj
    }
    ```