import { Property, Required } from '@tsed/common';
import { Model, MongoosePlugin, PreHook } from '@tsed/mongoose';
import { Example } from '@tsed/swagger';
import * as _ from 'lodash';
import * as passwordPlugin from 'mongoose-bcrypt';
import * as uniqueValidator from 'mongoose-unique-validator';
import * as uuid from 'uuid';

@Model()
@MongoosePlugin(uniqueValidator, undefined)
@MongoosePlugin(passwordPlugin, undefined)
export class User {
  @Property()
  public _id: string;

  @Property()
  @Example('JD')
  public initials: string;

  @Property()
  @Required()
  @Example('John')
  public firstName: string;

  @Property()
  @Required()
  @Example('Doe')
  public lastName: string;

  @Property()
  @Required()
  @Example('Test123!')
  public password: string;

  @Property()
  @Required()
  @Example('john.doe@example.com')
  public email: string;

  @Property()
  public token: string;

  /**
   * Pre Save for User
   * @param {User} user
   * @param next
   */
  @PreHook('save')
  static preSave(
    user: User,
    next
  ): void {
    if ( _.isNil(user.token) || user.token.trim() === '' ) {
      user.token = User.generateToken();
    }

    user.initials = User.generateInitials(user.firstName, user.lastName);

    next();
  }

  /**
   * Generate a new Token
   * @returns {string}
   */
  static generateToken(): string {
    return uuid.v4();
  }

  /**
   * Generate Initials based on first name and last name
   * @param {string} firstName
   * @param {string} lastName
   * @returns {string}
   */
  private static generateInitials(
    firstName: string,
    lastName: string
  ): string {
    let splitFirstName = firstName.split(' ');
    let splitLastName = lastName.split(' ')
      .reverse();

    if ( splitFirstName.length > 0 ) {
      splitFirstName.length = 1;
      splitFirstName = splitFirstName.map((firstNameItem) => firstNameItem.toUpperCase()[ 0 ]);
    }
    if ( splitLastName.length > 0 ) {
      splitLastName.length = 1;
      splitLastName = splitLastName.map((lastNameItem) => lastNameItem.toUpperCase()[ 0 ]);
    }

    return [
      ...splitFirstName,
      ...splitLastName
    ].join('');
  }

  /**
   * @returns {any}
   */
  public toJSON() {
    return {
      _id: this._id,
      initials: this.initials,
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email
    };
  }
}
