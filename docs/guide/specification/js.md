# :blue_book: JS编写规范

##  采用默认参数精简代码
:::danger bad
```js
function writeForumComment(subject, body) {
  subject = subject || 'No Subject';
  body = body || 'No text';
}
```
:::
:::tip good
```js
function writeForumComment(subject = 'No subject', body = 'No text') {
  ...
}

```
:::

##  使用 Object.assign 设置默认对象
:::danger bad
```js
// bad
var menuConfig = {
  title: null,
  body: 'Bar',
  buttonText: null,
  cancellable: true
}

function createMenu(config) {
  config.title = config.title || 'Foo'
  config.body = config.body || 'Bar'
  config.buttonText = config.buttonText || 'Baz'
  config.cancellable = config.cancellable === undefined ? config.cancellable : true;

}

createMenu(menuConfig);
```
:::
:::tip good
```js
var menuConfig = {
  title: 'Order',
  // User did not include 'body' key
  buttonText: 'Send',
  cancellable: true
}

function createMenu(config) {
  config = Object.assign({
    title: 'Foo',
    body: 'Bar',
    buttonText: 'Baz',
    cancellable: true
  }, config);

  // config now equals: {title: "Order", body: "Bar", buttonText: "Send", cancellable: true}
}

createMenu(menuConfig);
```
:::

##  避免无意义的条件判断
:::danger bad
```js
function createMicrobrewery(name) {
  var breweryName;
  if (name) {
    breweryName = name;
  } else {
    breweryName = 'Hipster Brew Co.';
  }
}
```
:::
::: tip good
```js
function createMicrobrewery(name) {
  var breweryName = name || 'Hipster Brew Co.'
}
```
:::


##  使用方法链
:::danger bad
```js
class Car {
  constructor() {
    this.make = 'Honda';
    this.model = 'Accord';
    this.color = 'white';
  }
  setMake(make) {
    this.name = name;
  }
  setModel(model) {
    this.model = model;
  }
  setColor(color) {
    this.color = color;
  }
  save() {
    console.log(this.make, this.model, this.color);
  }
}

let car = new Car();
car.setColor('pink');
car.setMake('Ford');
car.setModel('F-150')
car.save();
```
:::
:::tip good
```js
class Car {
  constructor() {
    this.make = 'Honda';
    this.model = 'Accord';
    this.color = 'white';
  }
  setMake(make) {
    this.name = name;
    // NOTE: Returning this for chaining
    return this;
  }
  setModel(model) {
    this.model = model;
    // NOTE: Returning this for chaining
    return this;
  }
  setColor(color) {
    this.color = color;
    // NOTE: Returning this for chaining
    return this;
  }
  save() {
    console.log(this.make, this.model, this.color);
  }
}

let car = new Car()
  .setColor('pink')
  .setMake('Ford')
  .setModel('F-150')
  .save();
```
:::

##  函数功能的单一性
:::danger bad
```js
function emailClients(clients) {
  clients.forEach(client => {
    let clientRecord = database.lookup(client);
    if (clientRecord.isActive()) {
      email(client);
    }
  });
}
```
:::
:::tip good
```js
function emailClients(clients) {
  clients.forEach(client => {
    emailClientIfNeeded(client);
  });
}

function emailClientIfNeeded(client) {
  if (isClientActive(client)) {
    email(client);
  }
}

function isClientActive(client) {
  let clientRecord = database.lookup(client);
  return clientRecord.isActive();
}

```
:::

