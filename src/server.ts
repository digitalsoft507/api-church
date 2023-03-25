import App from './app';

import {
  AppLoginController,
  AppAllController,
  AuthenticationController, 
  UserController,
  ProfileController,
  ChargeController,
  PreacherController,
  CountryController,
  ProvinceController,
  ChurcheController,
  WillController,
  BookController,
  ChapterController,
  VerseController,
  TeachingController,
  CultController,
  CoadjutorController
}
  from './controllers';

const { PORT } = process.env;

const app = new App(
  [
    new AppLoginController(),
    new AppAllController(),
    new AuthenticationController(),
    new UserController(),
    new ProfileController(),
    new ChargeController(),
    new PreacherController(),
    new CountryController(),
    new ProvinceController(),
    new ChurcheController(),
    new WillController(),
    new BookController(),
    new ChapterController(),
    new VerseController(),
    new TeachingController(),
    new CultController(),
    new CoadjutorController(),
  ],
  Number(PORT),
);

app.listen();