import App from './app';

import { AppLoginController, AppAllController } from './controllers/app/index';
import LoginController from './controllers/authentication/login.controller';
import UserController from './controllers/users/users.controller';
import ProfileController from './controllers/users/profiles.controller';
import ChargeController from './controllers/charge/charge.controller';
import PreacherController from './controllers/preacher/preacher.controller';
import CountryController from './controllers/country/country.controller';
import ProvinceController from './controllers/province/province.controller';
import ChurcheController from './controllers/churche/churche.controller';
import WillController from './controllers/will/will.controller';
import BookController from './controllers/book/book.controller';
import ChapterController from './controllers/chapter/chapter.controller';
import VerseController from './controllers/verse/verse.controller';
import TeachingController from './controllers/teaching/teaching.controller';
import CultController from './controllers/cult/cult.controller';
import CoadjutorController from './controllers/coadjutor/coadjutor.controller';

const { PORT } = process.env;

const app = new App(
  [
    new AppLoginController(),
    new AppAllController(),

    new LoginController(),
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