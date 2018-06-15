const moment = require('moment');
module.exports = {
  postReply: (req, res)=>{
    let db = req.app.get('db'),
        {user, date, comment, replyid, memeid, limit} = req.body,
        obj = {};
    console.log(req.body);
    db.postReply([date, comment, user.id, memeid, replyid]).then((response)=>{
      db.updateCommentReplies([replyid]).then((response)=>{
        obj = Object.assign({}, obj, {comment: response});
        db.getReplies([replyid, limit]).then((response)=>{
          obj = Object.assign({}, obj, {replies: response});
          res.status(200).send(obj);
        })
      })
    })
  },
  getReplies: (req, res)=>{
    let db = req.app.get('db'),
        id = req.params.id,
        limit = req.query.limit;
    db.getReplies([id, limit]).then((response)=>{
      res.status(200).send(response);
    })
  },
  getTopComments: (req, res)=>{
    let db = req.app.get('db'),
        meme = req.params.id;
    db.getTopComments([meme]).then((response)=>{
      res.status(200).send(response);
    })
  },
  postComment: (req, res)=>{
    let db = req.app.get('db'),
        { user, date, comment, meme } = req.body;
    db.updateMemeComments([meme.details.id]).then((response)=>{
      db.postComment([user.id, meme.details.id, date, comment]).then((response)=>{
        res.status(200).send(response);
      })
    })
  },
  unfeatureMeme: (req, res)=>{
    let db = req.app.get('db'),
        meme = req.query.id;
    db.unfeatureMeme([meme]).then((response)=>{
      res.status(200).send(response);
    })
  },
  featureMeme: (req, res)=>{
    let db = req.app.get('db'),
        meme = req.query.id;
    db.featureMeme([meme]).then((response)=>{
      res.status(200).send(response);
    })
  },
  deleteMeme: (req, res)=>{
    let db = req.app.get('db'),
        memeid = req.params.memeid,
        exactid = req.params.exactid;
    db.deleteAllCommentLikes([memeid]).then((response)=>{
      db.deleteAllComments([memeid]).then((response)=>{
        db.deleteAllTags([exactid]).then((response)=>{
          db.deleteAllLikes([memeid]).then((response)=>{
            db.deleteMeme([memeid]).then((response)=>{
              res.status(200).send(response);
            })
          })
        })
      })
    });
  },
  deleteRecentSearches: (req, res)=>{
    let db = req.app.get('db'),
        user = req.query.user;
    db.deleteRecentSearches([user]).then((response)=>{
      res.status(200).send(response);
    })
  },
  deleteComment: (req, res)=>{
    let db = req.app.get('db'),
        id = req.query.id,
        type = req.query.type,
        memeid = req.params.memeid,
        replyid = req.params.replyid;
    if (type === 'topreply' || type === 'reply') {
      db.deleteCommentLike([id]).then((response)=>{
        db.deleteComment([id]).then((response)=>{
          db.updateMemeRepliesCount([replyid]).then((response)=>{
            res.status(200).send(response);
          })
        })
      })
    } else {
      db.getCommentLikesToDelete([id]).then((response)=>{
        if (response) {
          response.map((el, i)=>{
            db.deleteCommentLike([el.id]);
          })
        }
        db.deleteCommentLike([id]).then((response)=>{
          db.deleteReplies([id]).then((response)=>{
            db.deleteComment([id]).then((response)=>{
              db.updateMemeCommentsCount([memeid]).then((response)=>{
                res.status(200).send(response);
              })
            })
          })
        });
      })
    }
  },
  getMainSearches: (req, res)=>{
    let db = req.app.get('db'),
        date = req.query.date;
    db.getMainSearches([date]).then((response)=>{
      res.status(200).send(response);
    })
  },
  getUserSearchResults: (req, res)=>{
    let db = req.app.get('db'),
        user = req.query.user;
    db.getUserSearchResults([user]).then((response)=>{
      res.status(200).send(response);
    })
  },
  postRecentSearch:(req, res)=>{
    let db = req.app.get('db'),
        user = req.body.user,
        text = req.body.text,
        date = req.body.date,
        type = req.body.type;
    db.postRecentSearch([text, date, type, user]).then((response)=>{
      res.status(200).send(response);
    })
  },
  getRecentSearches: (req, res)=>{
    let db = req.app.get('db'),
        user = req.query.user;
    if (user === 'popular') {
      let date = new Date();
      date = moment(date).subtract(30, 'days').utc().format('MM-DD-YYYY');
      db.getTrendingTags([date]).then((response)=>{
        res.status(200).send(response);
      });
    } else {
      db.getRecentSearches([user]).then((response)=>{
        res.status(200).send(response);
      })
    }
  },
  getSearchResults: (req, res)=>{
    let db = req.app.get('db'),
        tag = req.query.tag.replace(/\s/g,'');
    db.getSearchResults([tag]).then((response)=>{
      res.status(200).send(response);
    })
  },
  getResults: (req, res)=>{
    let db = req.app.get('db'),
        tag = req.query.tag;
    db.getResults([tag]).then((response)=>{
      res.status(200).send(response);
    })
  },
  getMemesByTag: (req, res)=>{
    let db = req.app.get('db'),
        tag = req.query.tag,
        limit = req.query.limit;
    db.getMemesByTag([tag, limit]).then((response)=>{
      res.status(200).send(response);
    })
  },
  getTrendingTags: (req, res)=>{
    let db = req.app.get('db'),
        date = req.query.date;
    db.getTrendingTags([date]).then((response)=>{
      res.status(200).send(response);
    });
  },
  checkLikes: (req, res)=>{
    let db = req.app.get('db'),
        user = req.params.userid,
        offset = req.query.offset;
    db.checkAllLikes([user, offset]).then((response)=>{
      res.status(200).send(response);
    })
  },
  checkCommentLikes: (req, res)=>{
    let db = req.app.get('db'),
        user = req.params.userid,
        meme = req.params.memeid,
        offset = req.query.offset;
    db.checkCommentLikes([user, meme, offset]).then((response)=>{
      res.status(200).send(response);
    })
  },
  getFeaturedMemes: (req, res)=>{
    let db = req.app.get('db'),
        limit = req.query.limit;
    db.getFeaturedMemes([limit]).then((response)=>{
      res.status(200).send(response);
    })
  },
  getMemes: (req, res)=>{
    let db = req.app.get('db'),
        limit = req.query.limit;
      db.getMemes([limit]).then((response)=>{
        res.status(200).send(response);
      });
  },
  unlikeMeme: (req, res)=>{
    let db = req.app.get('db'),
        user = req.body.user,
        meme = req.params.memeid,
        type = req.body.type,
        obj = {};
    db.unlikeMeme([user.id, meme]).then((response)=>{
      db.updateMemeUnlikes([meme]).then((response)=>{
        if (type >= 0) {
          db.getMemes([type]).then((response)=>{
            res.status(200).send(response);
          })
        } else {
          db.getMemeDetails([meme]).then((response)=>{
            res.status(200).send(response);
          })
        }
      })
    })
  },
  featuredUnlikeMeme: (req, res)=>{
    let db = req.app.get('db'),
        user = req.body.user,
        meme = req.params.memeid,
        type = req.body.type,
        obj = {};
    db.unlikeMeme([user.id, meme]).then((response)=>{
      db.updateMemeUnlikes([meme]).then((response)=>{
        if (type >= 0) {
          db.getFeaturedMemes([type]).then((response)=>{
            res.status(200).send(response);
          })
        } else {
          db.getMemeDetails([meme]).then((response)=>{
            res.status(200).send(response);
          })
        }
      })
    })
  },
  likeMeme: (req, res)=>{
    let db = req.app.get('db'),
    user = req.body.user,
    meme = req.params.memeid,
    date = new Date(),
        type = req.body.type,
        obj = {};
        db.likeMeme([date, user.id, meme]).then((response)=>{
          db.updateMemeLikes([meme]).then((response)=>{
            if (type >= 0) {
              db.getMemes([type]).then((response)=>{
                res.status(200).send(response);
              })
            } else {
              db.getMemeDetails([meme]).then((response)=>{
            res.status(200).send(response);
          })
        }
      })
    })
  },
  featuredLikeMeme: (req, res)=>{
    let db = req.app.get('db'),
    user = req.body.user,
        meme = req.params.memeid,
        date = new Date(),
        type = req.body.type,
        obj = {};
        db.likeMeme([date, user.id, meme]).then((response)=>{
          db.updateMemeLikes([meme]).then((response)=>{
            if (type >= 0) {
              db.getFeaturedMemes([type]).then((response)=>{
                res.status(200).send(response);
              })
            } else {
              db.getMemeDetails([meme]).then((response)=>{
                res.status(200).send(response);
              })
        }
      })
    })
  },
  likeComment: (req, res)=>{
    let db = req.app.get('db'),
        user = req.body.user,
        comment = req.params.commentid,
        meme = req.body.meme,
        date = new Date(),
        type = req.body.type,
        TC1 = req.body.TC1, 
        TC2 = req.body.TC2,
        offset = req.body.offset;
    db.likeComment([date, user.id, meme, comment]).then((response)=>{
      db.updateCommentLikes([comment]).then((response)=>{
        res.status(200).send(type);
      })
    })
  },
  unlikeComment: (req, res)=>{
    let db = req.app.get('db'),
        user = req.body.user,
        comment = req.params.commentid,
        meme = req.body.meme,
        type = req.body.type,
        TC1 = req.body.TC1, 
        TC2 = req.body.TC2,
        offset = req.body.offset;
    db.unlikeComment([user.id, comment]).then((response)=>{
      db.updateCommentUnlikes([comment]).then((response)=>{
        res.status(200).send(type)
      })
    })
  },
  checkMemeLikes: (req, res)=>{
    let db = req.app.get('db'),
    user = req.params.userid,
        meme = req.params.memeid;
    db.checkLikes([user, meme]).then((response)=>{
      if (response[0]) {
        res.status(200).send(true);
      } else {
        res.status(200).send(false);
      }
    })
  },
  
  getMemeDetails: (req, res)=>{
    let db = req.app.get('db'),
        id = req.params.id,
        query = req.query.commentPage,
        obj = {},
        meme_id,
        prev_id,
        next_id;
    let TC1 = 0,
        TC2 = 0;
    if (req.query.tc1 !== 'undefined') {
      TC1 = req.query.tc1;
    }
    if (req.query.tc2 !== 'undefined') {
      TC2 = req.query.tc2;
    }
    db.getMemeDetails([id]).then((response)=>{
      meme_id = response[0].meme_id;
      obj = Object.assign({}, obj, {details:response[0]});
      db.getMemeTags([meme_id]).then((response)=>{
        obj = Object.assign({}, obj, {tags:response})
        db.getMemeComments([id, (query-1)*10, TC1, TC2]).then((response)=>{
          obj = Object.assign({}, obj, {}, {comments:response});
          db.getSideMemes([id]).then((response)=>{
            if (response[0].next_id) {
              next_id = response[0].next_id;
            }
            if (response[0].prev_id) {
              prev_id = response[0].prev_id;
            }
            if (prev_id && next_id) {
              obj = Object.assign({}, obj, {prev_id, next_id})
              res.status(200).send(obj);
            } else if (!prev_id) {
              db.getLastMeme().then((response)=>{
                obj = Object.assign({}, obj, {prev_id:response[0].id, next_id});
                res.status(200).send(obj);
              })
            } else {
              db.getFirstMeme().then((response)=>{
                obj = Object.assign({}, obj, {prev_id, next_id:response[0].id});
                res.status(200).send(obj);
              })
            }
          })
        })
      })
    })
  },
  submitUsername: (req, res)=>{
    let username = (req.body.username).toLowerCase(),
        user = req.body.user,
        db = req.app.get('db');
    db.checkUsername([username]).then((response)=>{
      if (response.length===0) {
        db.submitUsername([username, user.id]).then((response)=>{
          res.status(200).send(response);
        })
      } else {
        res.status(200).send('Username Taken');
      }
    })
  },
  postMeme: (req, res)=>{
    let meme = req.body.meme,
        date = req.body.date,
        db = req.app.get('db');
    db.addMeme([meme.image.Location, 0, 0, meme.tags? meme.tags.length : 0, meme.caption, meme.image.key, req.body.user.id, (req.body.user.memes+1)]).then((finish)=>{
      res.status(200).send(finish);
      if (meme.tags[0]) {
        db.addTags([meme.tags[0].label, meme.image.key, date]).then((response)=>{
          if (meme.tags[1]) {
            db.addTags([meme.tags[1].label, meme.image.key, date]).then((response)=>{
              if (meme.tags[2]) {
                db.addTags([meme.tags[2].label, meme.image.key, date]).then((response)=>{
                  if (meme.tags[3]) {
                    db.addTags([meme.tags[3].label, meme.image.key, date]).then((response)=>{
                      if (meme.tags[4]) {
                        db.addTags([meme.tags[4].label, meme.image.key, date]).then((response)=>{
                           res.status(200).end();
                        })
                      }
                    })
                  }
                })
              }
            })
          }
        })
      }
    });
  }
}