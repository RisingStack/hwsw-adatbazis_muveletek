const adder = require('./adder')

describe('Adder module', () => {
  it('should expose a function', () => {
    expect(adder).toBeInstanceOf(Function)
  })

  it('should validate first input', () => {
    expect(adder.bind({}, '1')).toThrow()
  })

  it('should validate second input', () => {
    expect(adder.bind({}, 1, '2')).toThrow()
  })

  it('should validate second input', () => {
    expect(adder(1, 2)).toEqual(3)
  })
})