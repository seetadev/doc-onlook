/**
 * @jest-environment jsdom
 */

// Import the functions to test
const fs = require('fs');
const path = require('path');

// Read the source file and evaluate it in the test environment
const docOnlookSource = fs.readFileSync(
  path.join(__dirname, '../../doc-onlook/Sender Sample/doc-onlook.js'),
  'utf8'
);

// Mock jQuery
const mockAjax = jest.fn();
global.$ = {
  ajax: mockAjax
};

// Evaluate the source code to make functions available
eval(docOnlookSource);

describe('doc-onlook.js', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockAjax.mockReset();
  });

  describe('docOnlookSend', () => {
    const mockSuccessHandler = jest.fn();
    const mockErrorHandler = jest.fn();
    const testData = {
      name: 'test-file.pdf',
      type: 'pdf',
      fileData: 'base64encodeddata',
      destIP: '192.168.1.100'
    };

    it('should make AJAX request with correct parameters when jQuery is available', () => {
      docOnlookSend(
        testData.name,
        testData.type,
        testData.fileData,
        testData.destIP,
        mockSuccessHandler,
        mockErrorHandler
      );

      expect(mockAjax).toHaveBeenCalledTimes(1);
      expect(mockAjax).toHaveBeenCalledWith({
        data: {
          name: testData.name,
          type: testData.type,
          data: testData.fileData,
          action: 'SEND_FILE'
        },
        dataType: 'json',
        success: expect.any(Function),
        error: expect.any(Function),
        url: `http://${testData.destIP}:2112`,
        type: 'post',
        crossDomain: 'true'
      });
    });

    it('should call success handler when AJAX request succeeds', () => {
      const mockResponse = { status: 'success', message: 'File sent successfully' };
      
      mockAjax.mockImplementation((options) => {
        options.success(mockResponse);
      });

      docOnlookSend(
        testData.name,
        testData.type,
        testData.fileData,
        testData.destIP,
        mockSuccessHandler,
        mockErrorHandler
      );

      expect(mockSuccessHandler).toHaveBeenCalledWith(mockResponse);
      expect(mockErrorHandler).not.toHaveBeenCalled();
    });

    it('should call error handler when AJAX request fails', () => {
      const mockError = { status: 'error', message: 'Connection failed' };
      
      mockAjax.mockImplementation((options) => {
        options.error(mockError);
      });

      docOnlookSend(
        testData.name,
        testData.type,
        testData.fileData,
        testData.destIP,
        mockSuccessHandler,
        mockErrorHandler
      );

      expect(mockErrorHandler).toHaveBeenCalledWith(mockError);
      expect(mockSuccessHandler).not.toHaveBeenCalled();
    });

    it('should not make AJAX request when jQuery is not available', () => {
      global.$ = null;

      docOnlookSend(
        testData.name,
        testData.type,
        testData.fileData,
        testData.destIP,
        mockSuccessHandler,
        mockErrorHandler
      );

      expect(mockAjax).not.toHaveBeenCalled();
      expect(mockSuccessHandler).not.toHaveBeenCalled();
      expect(mockErrorHandler).not.toHaveBeenCalled();

      // Restore jQuery for other tests
      global.$ = { ajax: mockAjax };
    });

    it('should handle empty file name gracefully', () => {
      docOnlookSend(
        '',
        testData.type,
        testData.fileData,
        testData.destIP,
        mockSuccessHandler,
        mockErrorHandler
      );

      expect(mockAjax).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            name: ''
          })
        })
      );
    });

    it('should handle different file types', () => {
      const fileTypes = ['pdf', 'jpg', 'txt', 'csv'];
      
      fileTypes.forEach(type => {
        mockAjax.mockClear();
        
        docOnlookSend(
          `test.${type}`,
          type,
          testData.fileData,
          testData.destIP,
          mockSuccessHandler,
          mockErrorHandler
        );

        expect(mockAjax).toHaveBeenCalledWith(
          expect.objectContaining({
            data: expect.objectContaining({
              type: type
            })
          })
        );
      });
    });

    it('should construct correct URL with different IP addresses', () => {
      const ipAddresses = ['192.168.1.1', '10.0.0.1', '172.16.0.1'];
      
      ipAddresses.forEach(ip => {
        mockAjax.mockClear();
        
        docOnlookSend(
          testData.name,
          testData.type,
          testData.fileData,
          ip,
          mockSuccessHandler,
          mockErrorHandler
        );

        expect(mockAjax).toHaveBeenCalledWith(
          expect.objectContaining({
            url: `http://${ip}:2112`
          })
        );
      });
    });
  });

  describe('docOnlookFind', () => {
    const mockSuccessHandler = jest.fn();
    const mockErrorHandler = jest.fn();
    const testIP = '192.168.1.100';

    beforeEach(() => {
      mockSuccessHandler.mockReset();
      mockErrorHandler.mockReset();
    });

    it('should make AJAX request with correct parameters when jQuery is available', () => {
      docOnlookFind(testIP, mockSuccessHandler, mockErrorHandler);

      expect(mockAjax).toHaveBeenCalledTimes(1);
      expect(mockAjax).toHaveBeenCalledWith({
        data: {
          action: 'FIND_DEVICE'
        },
        dataType: 'json',
        success: expect.any(Function),
        error: expect.any(Function),
        url: `http://${testIP}:2112`,
        type: 'post',
        crossDomain: 'true'
      });
    });

    it('should call success handler when device is found', () => {
      const mockResponse = { 
        status: 'found', 
        device: 'doc-onlook-device',
        ip: testIP
      };
      
      mockAjax.mockImplementation((options) => {
        options.success(mockResponse);
      });

      docOnlookFind(testIP, mockSuccessHandler, mockErrorHandler);

      expect(mockSuccessHandler).toHaveBeenCalledWith(mockResponse);
      expect(mockErrorHandler).not.toHaveBeenCalled();
    });

    it('should call error handler when device is not found', () => {
      const mockError = { 
        status: 'error', 
        message: 'Device not found or not responding' 
      };
      
      mockAjax.mockImplementation((options) => {
        options.error(mockError);
      });

      docOnlookFind(testIP, mockSuccessHandler, mockErrorHandler);

      expect(mockErrorHandler).toHaveBeenCalledWith(mockError);
      expect(mockSuccessHandler).not.toHaveBeenCalled();
    });

    it('should not make AJAX request when jQuery is not available', () => {
      global.$ = null;

      docOnlookFind(testIP, mockSuccessHandler, mockErrorHandler);

      expect(mockAjax).not.toHaveBeenCalled();
      expect(mockSuccessHandler).not.toHaveBeenCalled();
      expect(mockErrorHandler).not.toHaveBeenCalled();

      // Restore jQuery for other tests
      global.$ = { ajax: mockAjax };
    });

    it('should handle network timeout scenarios', () => {
      const timeoutError = { 
        status: 'timeout', 
        message: 'Request timed out' 
      };
      
      mockAjax.mockImplementation((options) => {
        setTimeout(() => {
          options.error(timeoutError);
        }, 100);
      });

      docOnlookFind(testIP, mockSuccessHandler, mockErrorHandler);

      return new Promise((resolve) => {
        setTimeout(() => {
          expect(mockErrorHandler).toHaveBeenCalledWith(timeoutError);
          resolve();
        }, 150);
      });
    });

    it('should work with different IP address formats', () => {
      const ipAddresses = [
        '192.168.1.1',
        '10.0.0.100',
        '172.16.255.1',
        '127.0.0.1'
      ];
      
      ipAddresses.forEach(ip => {
        mockAjax.mockClear();
        
        docOnlookFind(ip, mockSuccessHandler, mockErrorHandler);

        expect(mockAjax).toHaveBeenCalledWith(
          expect.objectContaining({
            url: `http://${ip}:2112`
          })
        );
      });
    });
  });

  describe('Integration Tests', () => {
    it('should be able to find device and then send file', async () => {
      const mockSuccessHandler = jest.fn();
      const mockErrorHandler = jest.fn();
      const testIP = '192.168.1.100';
      
      // Mock finding device successfully
      mockAjax.mockImplementationOnce((options) => {
        options.success({ status: 'found', device: 'doc-onlook' });
      });

      docOnlookFind(testIP, mockSuccessHandler, mockErrorHandler);
      
      expect(mockSuccessHandler).toHaveBeenCalled();
      
      // Reset mocks for file sending
      mockSuccessHandler.mockReset();
      mockErrorHandler.mockReset();
      
      // Mock sending file successfully
      mockAjax.mockImplementationOnce((options) => {
        options.success({ status: 'success', message: 'File received' });
      });

      docOnlookSend(
        'test.pdf',
        'pdf',
        'filedata',
        testIP,
        mockSuccessHandler,
        mockErrorHandler
      );

      expect(mockSuccessHandler).toHaveBeenCalledWith({
        status: 'success',
        message: 'File received'
      });
    });

    it('should handle network errors gracefully in workflow', () => {
      const mockSuccessHandler = jest.fn();
      const mockErrorHandler = jest.fn();
      const testIP = '192.168.1.100';
      
      // Mock device not found
      mockAjax.mockImplementationOnce((options) => {
        options.error({ status: 'error', message: 'Device not found' });
      });

      docOnlookFind(testIP, mockSuccessHandler, mockErrorHandler);
      
      expect(mockErrorHandler).toHaveBeenCalledWith({
        status: 'error',
        message: 'Device not found'
      });
      expect(mockSuccessHandler).not.toHaveBeenCalled();
    });
  });
});