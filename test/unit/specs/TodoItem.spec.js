import Vue from 'vue';
import TodoItem from '@/components/TodoItem';

describe('TodoItem.vue', () => {
  describe('Should set the default data correctly', () => {
    let Constructor, vm, defaultData;

    before(() => {
      Constructor = Vue.extend(TodoItem);
      vm = new Constructor().$mount();
      defaultData = vm.$options.data();
    });

    it('beforeEditCache should be empty string', () => {
      expect(defaultData.beforeEditCache)
        .to.equal('');
    });

    it('editedTodo should be empty object', () => {
      let keysOfObject = Object.keys(defaultData.editedTodo);
      expect(keysOfObject.length)
        .to.equal(0);
    });
  });

  describe('Methods should function properly', () => {
    let Constructor, vm, defaultData, methods;
    let todoItem = { id: 0, title: 'test', completed: true };

    before(() => {
      Constructor = Vue.extend(TodoItem);
      vm = new Constructor().$mount();
      defaultData = vm.$options.data();
      methods = vm.$options.methods;
    });

    it('editTodo should update beforeEditCache with title', () => {
      methods.editTodo.call(defaultData, todoItem);
      expect(defaultData.beforeEditCache)
        .to.equal(todoItem.title);
    });

    it('editTodo should update editedTodo with new object', () => {
      methods.editTodo.call(defaultData, todoItem);
      expect(JSON.stringify(defaultData.editedTodo))
        .to.equal(JSON.stringify(todoItem));
    });

    it('doneEdit should update editedTodo with null', () => {
      defaultData.editedTodo = 'edited';
      let ref = {
        ...defaultData,
        ...methods,
      };
      methods.doneEdit.call(ref, todoItem);
      expect(ref.editedTodo)
        .to.equal(null);
    });

    it('doneEdit should return not update todo item if editedTodo is null', () => {
      defaultData.editedTodo = null;
      let ref = {
        ...defaultData,
        ...methods,
      };
      let value = methods.doneEdit.call(ref);
      expect(value)
        .to.equal(undefined);
    });

    it('removeItem event should be triggered if edited title is empty', () => {
      defaultData.editedTodo = todoItem;
      let eventTriggered = false;
      let ref = {
        ...defaultData,
        ...methods,
        $emit: function () {          
          eventTriggered = true;
        }
      };
      todoItem.title = '';
      methods.doneEdit.call(ref, todoItem);
      expect(eventTriggered)
        .to.equal(true);
    });

    it('cancelEdit should default editedtodo to null', () => {
      methods.cancelEdit.call(defaultData, todoItem);
      expect(defaultData.editedTodo)
        .to.equal(null);
    });

    it('cancelEdit should restore the previous value', () => {
      defaultData.beforeEditCache = 'before edit';
      methods.cancelEdit.call(defaultData, todoItem);
      expect(todoItem.title)
        .to.equal(defaultData.beforeEditCache);
    });
  });

  describe('Directives should function properly', () => {
    let Constructor, vm, directives;

    before(() => {
      Constructor = Vue.extend(TodoItem);
      vm = new Constructor().$mount();
      directives = vm.$options.directives;
    });

    it(`element's focus should be called when directive is triggered`, () => {
      let func = directives['todo-focus'].bind;
      let focusCalled = false;
      let ele = {
        focus: function () {
          focusCalled = true;
        }
      };
      let binding = {
        value: ' '
      };
      func(ele, binding);
      expect(focusCalled)
        .to.equal(true);
    });
  });
});
