function navigateTo(page) {
    switch(page) {
        case 'reserve':
            window.location.href = 'reserve.html';
            break;
        case 'park':
            window.location.href = 'park.html';
            break;
        case 'find':
            window.location.href = 'find.html';
            break;
        case 'leave':
            window.location.href = 'leave.html';
            break;
        default:
            console.error('Unknown page:', page);
    }
}
