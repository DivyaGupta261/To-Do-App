import Vue from 'vue';
import NewTodo from '@/components/NewTodo';

describe('NewTodo.vue', () => {
  describe('Should render contents', () => {
    let Constructor, vm, element;
    before(()=> {
      Constructor = Vue.extend(NewTodo);
      vm = new Constructor().$mount();
      element = vm.$el;
    });

    it('Input box for entering new task', () => {
      expect(element.value)
        .to.equal('');
    });

    it('Input element should contain placeholder', () => {
      expect(element.placeholder)
        .to.equal('What needs to be done?');
    });
  });

  describe('Should set the default data correctly', () => {
    let Constructor, vm, defaultData;
    before(()=> {
      Constructor = Vue.extend(NewTodo);
      vm = new Constructor().$mount();
      defaultData = vm.$options.data();
    });
    
    it('newTodo should be a empty string', () => {
      expect(defaultData.newTodo)
        .to.equal('');
    });
  });

  describe('Methods should function properly', () => {
    let Constructor, vm, methods;
    before(()=> {
      Constructor = Vue.extend(NewTodo);
      vm = new Constructor().$mount();
      methods = vm.$options.methods;
    });
    it('addTodo should push the object into todos array', () => {
      let ref = {
        newTodo: 'new task',
        todos: [],
        uid: 0,
        $emit: function (params) {}
      };
      methods.addTodo.call(ref);
      expect(ref.todos.length)
        .to.equal(1);
    });
    it('addTodo should push the object into todos array', () => {
      let ref = {
        newTodo: '',
        todos: [],
      };
      methods.addTodo.call(ref);
      expect(ref.todos.length)
        .to.equal(0);
    });
  });
});
