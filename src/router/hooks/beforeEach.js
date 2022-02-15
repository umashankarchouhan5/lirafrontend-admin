import Auth from 'Utils/auth';

const beforeEach = (to, from, next) => {
    if (to.meta.auth && !Auth.isUserLogged()) {
        return next('/login');
    }
    next();
};

export default beforeEach;