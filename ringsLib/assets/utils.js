export const limitText = (_t, _l) =>
    _t.length > _l ?
    `${_t.substr(0,_t.lastIndexOf(' ',_l) || _l)}...` :
    _t;