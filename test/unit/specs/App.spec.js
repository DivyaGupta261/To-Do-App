import Vue from 'vue';
import App from '@/App';
import { before } from 'mocha';

describe('App.vue', () => {
  describe('Should render contents', () => {
    let Constructor, vm;

    before(() => {
      Constructor = Vue.extend(App);
      vm = new Constructor().$mount();
    });

    it('Heading', () => {
      expect(vm.$el.querySelector('.header h1').textContent)
        .to.equal('todos');
    });

    it('Input element for entering new task', () => {
      expect(vm.$el.querySelector('input.new-todo').placeholder)
        .to.equal('What needs to be done?');
    });

    it('Todo Count', () => {
      expect(vm.$el.querySelector('.todo-count').textContent.trim())
        .to.equal('0 items left');
    });

    it('Filters', () => {
      expect(vm.$el.querySelector('.filters').textContent.trim())
        .to.equal('All Active Completed');
    });
  });

  describe('Should set the default data correctly', () => {
    let Constructor, vm, defaultData;

    before(() => {
      Constructor = Vue.extend(App);
      vm = new Constructor().$mount();
      defaultData = vm.$options.data();
    });

    it('todos should be empty array', () => {
      const len = defaultData.todos.length;
      expect(len).to.equal(0);
    });

    it('default visibility should be ALL', () => {
      const visibility = defaultData.visibility;
      expect(visibility).to.equal('all');
    });

    it('uid should be 0', () => {
      const uid = defaultData.uid;
      expect(uid).to.equal(0);
    });
  });

  describe('Methods should function properly', () => {
    let Constructor, vm, defaultData, methods, watch, computed;
    let todoItem = { id: 0, title: 'test', completed: true };
    let completedItem = { id: 1, title: 'completed', completed: true };
    let activeItem = { id: 2, title: 'active', completed: false };

    before(() => {
      Constructor = Vue.extend(App);
      vm = new Constructor().$mount();
      defaultData = vm.$options.data();
      defaultData.todos.push(todoItem);
      defaultData.todos.push(completedItem);
      defaultData.todos.push(activeItem);
      methods = vm.$options.methods;
      watch = vm.$options.watch;
      computed = vm.$options.computed;
    });

    it('removeTodo should remove items from todos array', () => {
      const prevLen = defaultData.todos.length;
      methods.removeTodo.call(defaultData, todoItem);
      const len = defaultData.todos.length;
      expect(prevLen - len).to.equal(1);
    });

    it('removeCompleted should remove completed items from todos array', () => {    
      methods.removeCompleted.call(defaultData);
      const len = defaultData.todos.length;
      expect(len).to.equal(1);
    });

    it('changeVisibility should change visibility', () => {
      methods.changeVisibility.call(defaultData, 'active');
      const visibility = defaultData.visibility;
      expect(visibility).to.equal('active');
    });

    it('UID should get incremented when it is updated', () => {
      methods.updateUID.call(defaultData);
      const uid = defaultData.uid;
      expect(uid).to.equal(1);
    });

    it('UID should get incremented when it is updated', () => {
      defaultData.uid = 0;
      methods.updateUID.call(defaultData);
      const uid = defaultData.uid;
      expect(uid).to.equal(1);
    });

    it('save should add todos in localstorage', () => {
      methods.save.call(defaultData, defaultData.todos);
      let localStorage = window.localStorage;
      let todoString = localStorage.getItem(defaultData.STORAGE_KEY);
      expect(todoString).to.equal(JSON.stringify(defaultData.todos));
    });

    it('fetch should update uid with tasks length', () => {
      methods.fetch.call(defaultData);
      let localStorage = window.localStorage;
      let todoString = localStorage.getItem(defaultData.STORAGE_KEY);
      let length = JSON.parse(todoString).length;
      expect(defaultData.uid).to.equal(length);
    });

    it('when todos watch handler is called, localstorage should be set', () => {
      watch.todos.handler.call(methods, defaultData.todos);
      let localStorage = window.localStorage;
      let todoString = localStorage.getItem(defaultData.STORAGE_KEY);
      expect(todoString).to.equal(JSON.stringify(defaultData.todos));
    });

    it('when alldone is called, remaining active todos should be 0', () => {
      computed.allDone.set.call(defaultData, true);
      let todos = defaultData.filtersMethods.active(defaultData.todos);
      const len = todos.length;
      expect(len).to.equal(0);
    });

    describe('Filter methods', () => {
      before(() => {
        defaultData.todos = [];
        let completedItem = { id: 1, title: 'completed', completed: true };
        let activeItem = { id: 2, title: 'active', completed: false };
        defaultData.todos.push(completedItem);
        defaultData.todos.push(activeItem);
      });

      it('all should return all tasks', () => {
        let todos = defaultData.filtersMethods.all(defaultData.todos);
        const len = todos.length;
        expect(len).to.equal(2);
      });

      it('active should return uncompleted tasks', () => {
        let todos = defaultData.filtersMethods.active(defaultData.todos);
        const len = todos.length;
        expect(len).to.equal(1);
      });

      it('completed should return completed tasks', () => {
        let todos = defaultData.filtersMethods.completed(defaultData.todos);
        const len = todos.length;
        expect(len).to.equal(1);
      });
    });

  });
});
