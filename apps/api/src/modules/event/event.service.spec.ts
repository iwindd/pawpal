import { EventService } from './event.service';

// Mock the sub-services
jest.mock('./services/admin-event.service', () => ({
  AdminEventService: jest.fn().mockImplementation(() => ({
    onNewJobOrder: jest.fn(),
    onNewJobTransaction: jest.fn(),
  })),
}));

jest.mock('./services/user-event.service', () => ({
  UserEventService: jest.fn().mockImplementation(() => ({
    onOrderUpdate: jest.fn(),
  })),
}));

describe('EventService', () => {
  let service: EventService;

  beforeEach(() => {
    service = new EventService();
  });

  it('should have admin sub-service', () => {
    expect(service.admin).toBeDefined();
  });

  it('should have user sub-service', () => {
    expect(service.user).toBeDefined();
  });

  it('admin should have event emission methods', () => {
    expect(service.admin.onNewJobOrder).toBeDefined();
    expect(service.admin.onNewJobTransaction).toBeDefined();
  });

  it('user should have event emission methods', () => {
    expect(service.user.onOrderUpdate).toBeDefined();
  });
});
