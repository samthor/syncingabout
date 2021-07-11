
export default async function foo(arg) {
  console.debug('task got', arg);
  await new Promise((r) => setTimeout(r, 1000));
  return 123;
}
