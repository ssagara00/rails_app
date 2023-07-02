export const mockedUseAlertReturn = {
    info: jest.fn(),
    success: jest.fn(),
    error: jest.fn(),
}
export const useAlert = () => mockedUseAlertReturn