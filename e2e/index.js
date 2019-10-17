import { Selector } from "testcafe";

fixture`Todo app`.page`http://127.0.0.1:8080`;

const createTodo = async t => {
  // create our new todo
  await t.typeText('[aria-label="new todo message"', "test message!");
  await t.click(Selector("button").withText("Add"));
};

test("User can create a todo", async t => {
  // create our new todo
  await createTodo(t);

  // assert that is has been created
  await t.expect(Selector('[aria-label="todo"]').count).eql(1);
});

test("Todos are persisted", async t => {
  // create our new todo
  await createTodo(t);

  // assert that is has been created
  await t.expect(Selector('[aria-label="todo"]').count).eql(1);
  // assert that it is persisted
  await t.eval(() => location.reload(true));
  await t.expect(Selector('[aria-label="todo"]').count).eql(1);
});

test("User can delete a todo", async t => {
  // create our new todo
  await createTodo(t);

  // assert that is has been created
  await t.expect(Selector('[aria-label="todo"]').count).eql(1);

  await t.click(Selector('[aria-label="delete todo"]'));

  // assert that is has been deleted
  await t.expect(Selector('[aria-label="todo"]').count).eql(0);
});

test("User can delete all todos at once", async t => {
  // create our new todo
  await createTodo(t);
  await createTodo(t);

  // assert that is has been created
  await t.expect(Selector('[aria-label="todo"]').count).eql(2);

  await t.click(Selector('[aria-label="clear"]'));

  // assert that is has been deleted
  await t.expect(Selector('[aria-label="todo"]').count).eql(0);
});
