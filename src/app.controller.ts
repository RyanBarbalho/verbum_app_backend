import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { UserService } from './user/user.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly userService: UserService
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('test-db')
  async testDb() {
    try {
      // Try to create a test user
      const testUser = await this.userService.create({
        username: 'testuser',
        email: 'test@example.com',
        password: 'testpass123'
      });

      // Try to find the user
      const foundUser = await this.userService.find(testUser.id);

      // Delete the test user
      await this.userService.deleteUser(testUser.id);

      return {
        status: 'success',
        message: 'Database connection is working!',
        testUser: foundUser
      };
    } catch (error) {
      return {
        status: 'error',
        message: 'Database connection failed!',
        error: error.message
      };
    }
  }
}
