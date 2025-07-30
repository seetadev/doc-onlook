// Mock jQuery for testing purposes

const mockAjax = jest.fn();

const mockJQuery = jest.fn(() => ({
  ajax: mockAjax,
  // Add other jQuery methods as needed
  ready: jest.fn(),
  on: jest.fn(),
  off: jest.fn(),
  click: jest.fn(),
  submit: jest.fn(),
  val: jest.fn(),
  text: jest.fn(),
  html: jest.fn(),
  attr: jest.fn(),
  prop: jest.fn(),
  addClass: jest.fn(),
  removeClass: jest.fn(),
  show: jest.fn(),
  hide: jest.fn()
}));

mockJQuery.ajax = mockAjax;

// Mock common jQuery AJAX methods
mockJQuery.get = jest.fn();
mockJQuery.post = jest.fn();
mockJQuery.put = jest.fn();
mockJQuery.delete = jest.fn();

// Mock jQuery utilities
mockJQuery.extend = jest.fn();
mockJQuery.isArray = jest.fn();
mockJQuery.isFunction = jest.fn();
mockJQuery.isPlainObject = jest.fn();

module.exports = mockJQuery;