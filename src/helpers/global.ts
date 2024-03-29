export enum Info {
    LOGIN_BAD_CREDENCIAL = 'Login Email does not exist',
    LOGIN_INVALID_PASSWORD = 'Login Invalid password',
    LOGIN_SUCCESS = 'Login Success',
    LOGIN_NOT_PROFILE = 'The user does not have an assigned profile',
    LOGIN_NOT_ROLES = 'The user does not roles assigned',

    ROLES_NOT_FOUND = 'There are no registered roles.',
    ROLES_LIST = 'The roles registered success.',

    PROFILES_NOT_FOUND = 'There are no registered profiles.',
    PROFILE_LIST = 'The profiles registered success.',
    PROFILE_FOUND = 'The profile found.',
    PROFILE_NOT_FOUND = 'The profile is not found.',
    PROFILE_NOT_ALLOW_UPDATED = 'The profile is not allowed to update.',
    PROFILE_NOT_UPDATED = 'The profile could not be updated.',
    PROFILE_UPDATED = 'The profile updated success.',
    PROFILE_NAME_ALREADY = 'The profile already exists,',
    PROFILE_NOT_REGISTRED = 'The profile could not be registered.',
    PROFILE_REGISTRED = 'The profile registered success.',
    PROFILE_DELETED = 'The profile delete success.',
    PROFILE_NOT_DELETED = 'The profile could not be delete.',
    PROFILE_NOT_ALLOW_DELETED = 'The profile is not allowed to delete.',

    USERS_NOT_FOUND = 'There are no registered users.',
    USER_LIST = 'The users registered success.',
    USER_FOUND = 'The user found.',
    USER_NOT_FOUND = 'The user is not found.',
    USER_UPDATED = 'The user updated success.',
    USER_NOT_UPDATED = 'The user could not be updated.',
    USER_EMAIL_ALREADY = 'The email already exists,',
    USER_REGISTRED = 'The user registered success.',
    USER_NOT_REGISTRED = 'The user could not be registered.',
    USER_DELETED = 'The user delete success.',
    USER_NOT_DELETED = 'The user could not be delete.',
    USER__PASSWORD_UPDATED = 'The user changed password success.',
    USER_PASSWORD_NOT_UPDATED = 'The user could not be changed password.',
    USER_PASSWORD_NOT_MATCH = 'The password not match.',

    CHARGES_NOT_FOUND = 'There are no registered charges.',
    CHARGES_LIST = 'The charges registered success.',
    CHARGE_ALREADY = 'The charge already exists,',
    CHARGE_REGISTRED = 'The charge registered success.',
    CHARGE_NOT_REGISTRED = 'The charge could not be registered.',
    CHARGE_NOT_FOUND = 'The charge is not found.',
    CHARGE_UPDATED = 'The charge updated success.',
    CHARGE_NOT_UPDATED = 'The charge could not be updated.',
    CHARGE_DELETED = 'The charge delete success.',
    CHARGE_NOT_DELETED = 'The charge could not be delete.',
    CHARGE_LIST = 'The charges registered success.',
    CHARGE_FOUND = 'The charge found.',
    
    PREACHERS_NOT_FOUND = 'There are no registered preachers.',
    PREACHERS_LIST = 'The preachers registered success.',
    PREACHER_ALREADY = 'The preacher already exists,',
    PREACHER_REGISTRED = 'The preacher registered success.',
    PREACHER_NOT_REGISTRED = 'The preacher could not be registered.',
    PREACHER_NOT_FOUND = 'The preacher is not found.',
    PREACHER_UPDATED = 'The preacher updated success.',
    PREACHER_NOT_UPDATED = 'The preacher could not be updated.',
    PREACHER_DELETED = 'The preacher delete success.',
    PREACHER_NOT_DELETED = 'The preacher could not be delete.',
    PREACHER_LIST = 'The preachers registered success.',
    PREACHER_FOUND = 'The preacher found.',

    COUNTRYS_NOT_FOUND = 'There are no registered countrys.',
    COUNTRYS_LIST = 'The countrys registered success.',
    COUNTRY_ALREADY = 'The country already exists,',
    COUNTRY_REGISTRED = 'The country registered success.',
    COUNTRY_NOT_REGISTRED = 'The country could not be registered.',
    COUNTRY_NOT_FOUND = 'The country is not found.',
    COUNTRY_UPDATED = 'The country updated success.',
    COUNTRY_NOT_UPDATED = 'The country could not be updated.',
    COUNTRY_DELETED = 'The country delete success.',
    COUNTRY_NOT_DELETED = 'The country could not be delete.',
    COUNTRY_LIST = 'The countrys registered success.',
    COUNTRY_FOUND = 'The country found.',

    PROVINCES_NOT_FOUND = 'There are no registered provinces.',
    PROVINCES_LIST = 'The provinces registered success.',
    PROVINCE_ALREADY = 'The province already exists,',
    PROVINCE_REGISTRED = 'The province registered success.',
    PROVINCE_NOT_REGISTRED = 'The province could not be registered.',
    PROVINCE_NOT_FOUND = 'The province is not found.',
    PROVINCE_UPDATED = 'The province updated success.',
    PROVINCE_NOT_UPDATED = 'The province could not be updated.',
    PROVINCE_DELETED = 'The province delete success.',
    PROVINCE_NOT_DELETED = 'The province could not be delete.',
    PROVINCE_LIST = 'The provinces registered success.',
    PROVINCE_FOUND = 'The province found.',
    
    CHURCHES_NOT_FOUND = 'There are no registered churchs.',
    CHURCHES_LIST = 'The churchs registered success.',
    CHURCHE_ALREADY = 'The church already exists,',
    CHURCHE_REGISTRED = 'The church registered success.',
    CHURCHE_NOT_REGISTRED = 'The church could not be registered.',
    CHURCHE_NOT_FOUND = 'The church is not found.',
    CHURCHE_UPDATED = 'The church updated success.',
    CHURCHE_NOT_UPDATED = 'The church could not be updated.',
    CHURCHE_DELETED = 'The church delete success.',
    CHURCHE_NOT_DELETED = 'The church could not be delete.',
    CHURCHE_LIST = 'The churchs registered success.',
    CHURCHE_FOUND = 'The church found.',

    WILLS_NOT_FOUND = 'There are no registered wills.',
    WILLS_LIST = 'The wills registered success.',
    WILL_ALREADY = 'The will already exists,',
    WILL_REGISTRED = 'The will registered success.',
    WILL_NOT_REGISTRED = 'The will could not be registered.',
    WILL_NOT_FOUND = 'The will is not found.',
    WILL_UPDATED = 'The will updated success.',
    WILL_NOT_UPDATED = 'The will could not be updated.',
    WILL_DELETED = 'The will delete success.',
    WILL_NOT_DELETED = 'The will could not be delete.',
    WILL_LIST = 'The wills registered success.',
    WILL_FOUND = 'The will found.',
    WILL_CHOICE = 'Choice a will.',

    BOOKS_NOT_FOUND = 'There are no registered books.',
    BOOKS_LIST = 'The books registered success.',
    BOOK_ALREADY = 'The book already exists,',
    BOOK_REGISTRED = 'The book registered success.',
    BOOK_NOT_REGISTRED = 'The book could not be registered.',
    BOOK_NOT_FOUND = 'The book is not found.',
    BOOK_UPDATED = 'The book updated success.',
    BOOK_NOT_UPDATED = 'The book could not be updated.',
    BOOK_DELETED = 'The book delete success.',
    BOOK_NOT_DELETED = 'The book could not be delete.',
    BOOK_LIST = 'The books registered success.',
    BOOK_FOUND = 'The book found.',
    BOOK_CHOICE = 'Choice a book.',

    CHAPTERS_NOT_FOUND = 'There are no registered chapters.',
    CHAPTERS_LIST = 'The chapters registered success.',
    CHAPTER_ALREADY = 'The chapter already exists,',
    CHAPTER_REGISTRED = 'The chapter registered success.',
    CHAPTER_NOT_REGISTRED = 'The chapter could not be registered.',
    CHAPTER_NOT_FOUND = 'The chapter is not found.',
    CHAPTER_UPDATED = 'The chapter updated success.',
    CHAPTER_NOT_UPDATED = 'The chapter could not be updated.',
    CHAPTER_DELETED = 'The chapter delete success.',
    CHAPTER_NOT_DELETED = 'The chapter could not be delete.',
    CHAPTER_LIST = 'The chapters registered success.',
    CHAPTER_FOUND = 'The chapter found.',

    VERSES_NOT_FOUND = 'There are no registered verses.',
    VERSES_LIST = 'The verses registered success.',
    VERSE_ALREADY = 'The verse already exists,',
    VERSE_REGISTRED = 'The verse registered success.',
    VERSE_NOT_REGISTRED = 'The verse could not be registered.',
    VERSE_NOT_FOUND = 'The verse is not found.',
    VERSE_UPDATED = 'The verse updated success.',
    VERSE_NOT_UPDATED = 'The verse could not be updated.',
    VERSE_DELETED = 'The verse delete success.',
    VERSE_NOT_DELETED = 'The verse could not be delete.',
    VERSE_LIST = 'The verses registered success.',
    VERSE_FOUND = 'The verse found.',

    TEACHINGS_NOT_FOUND = 'There are no registered teachings.',
    TEACHINGS_LIST = 'The teachings registered success.',
    TEACHING_ALREADY = 'The teaching already exists,',
    TEACHING_REGISTRED = 'The teaching registered success.',
    TEACHING_NOT_REGISTRED = 'The teaching could not be registered.',
    TEACHING_NOT_FOUND = 'The teaching is not found.',
    TEACHING_UPDATED = 'The teaching updated success.',
    TEACHING_NOT_UPDATED = 'The teaching could not be updated.',
    TEACHING_DELETED = 'The teaching delete success.',
    TEACHING_NOT_DELETED = 'The teaching could not be delete.',
    TEACHING_LIST = 'The teachings registered success.',
    TEACHING_FOUND = 'The teaching found.',

    CULTS_NOT_FOUND = 'There are no registered cults.',
    CULTS_LIST = 'The cults registered success.',
    CULT_ALREADY = 'The cult already exists,',
    CULT_REGISTRED = 'The cult registered success.',
    CULT_NOT_REGISTRED = 'The cult could not be registered.',
    CULT_NOT_FOUND = 'The cult is not found.',
    CULT_UPDATED = 'The cult updated success.',
    CULT_NOT_UPDATED = 'The cult could not be updated.',
    CULT_DELETED = 'The cult delete success.',
    CULT_NOT_DELETED = 'The cult could not be delete.',
    CULT_LIST = 'The cults registered success.',
    CULT_FOUND = 'The cult found.',
    CULT_DATE_OUT = 'The hours of worship have passed.',

    VERSE_READS_NOT_FOUND = 'There are no registered verse reads.',
    VERSE_READS_LIST = 'The verse reads registered success.',
    VERSE_READ_ALREADY = 'The verse read already exists,',
    VERSE_READ_REGISTRED = 'The verse read registered success.',
    VERSE_READ_NOT_REGISTRED = 'The verse read could not be registered.',
    VERSE_READ_NOT_FOUND = 'The verse read is not found.',
    VERSE_READ_UPDATED = 'The verse read updated success.',
    VERSE_READ_NOT_UPDATED = 'The verse read could not be updated.',
    VERSE_READ_DELETED = 'The verse read delete success.',
    VERSE_READ_NOT_DELETED = 'The verse read could not be delete.',
    VERSE_READ_LIST = 'The verse reads registered success.',
    VERSE_READ_FOUND = 'The verse read found.',

    SERVER_ERROR_INERNAL = 'Internal Error Server',

    UNAUTHORIZED = 'Unauthorized',
    ORIGIN_NOT_IMPLEMENTED = 'Origin not correctly implemented',

    TOKEN_INVALID = 'The token is not valid.',

}