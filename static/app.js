'use strict'

var __forEach = Array.prototype.forEach
var rActive = /active/g

function initImgWapper (body) {
  var div = document.createElement('div')
  div.id = 'img-wapper'
  body.appendChild(div)
  return div
}

function getMetaInfo (isPrint) {
  var head = document.getElementsByTagName('head')[0]
  var childNodes = head.childNodes
  var meta = {}
  __forEach.call(head.children, function (child) {
    var name = child.getAttribute('name')
    if (child.nodeName === 'TITLE') {
      meta.title = child.innerText
      return
    }
    if (name === null || name === "" || name === undefined) return
    meta[name] = child.getAttribute('content')
  })
  for (var i = 0, max = childNodes.length; i < max; i++) {
    var cn = childNodes[i]
    if (cn.nodeName !== '#comment') continue
    // TODO: maybe here will wrong
    meta.generatedTime = cn.data.slice(1,-1) // remove the blank symbol
    break
  }

  if (isPrint === true) {
    // Print the Article's meta information
    console.log('Article\'s Meta')
    __forEach.call(Object.keys(meta), function (name) {
      console.log(name.toUpperCase() + ': ' + meta[name])
    })
  }
  return meta
}

function showBanner (body, content) {
  var div = document.createElement('div')
  // var img = document.createElement('img')
  // var a = document.createElement('a')
  // img.onload = function () {
  //   body.insertBefore(div, content)
  // }
  // a.href = 'https://github.com/creamidea'
  // a.alt = a.title = 'Check me out on :octocat:'
  // img.src = 'foundingfather_v2.png'
  div.id = 'banner-wrapper'
  body.insertBefore(div, content)
  // a.appendChild(img)
  // div.appendChild(a)
  
  // __forEach.call(['e', 'i&#960;', '+', '1', '=', '0'], function(s, index) {
  //   var tag
  //   if (index === 1) {
  //     tag = document.createElement('sup')
  //   } else {
  //     tag = document.createElement('span')            
  //   }
  //   tag.innerHTML = s
  //   div.appendChild(tag)
  // })
  // body.insertBefore(div, content)

  var title = content.getElementsByClassName('title')
  if (title && title.length > 0) {
    title[0].style.display = 'none'
  }
}

function showHomeButton (body) {
  var div = document.createElement('div')
  var a = document.createElement('a')
  var img = document.createElement('img')
  div.id = "avatar-wapper"
  a.href = '/'
  a.alt = 'Return'
  img.src = '/static/avatar.png'
  img.alt = 'Return'
  div.appendChild(a)
  a.appendChild(img)
  body.appendChild(div)
}

function showFooter (body, content, meta) {
  // TODO: change the email
  var footer = document.createElement('footer')
  footer.innerHTML =
    '<p><a href="http://creativecommons.org/licenses/by-nc-sa/3.0/cn/">Attribution-NonCommercial-ShareAlike 3.0 China Mainland</a></p>' +
    '<p>Author is <a href="'+meta.linkedin+'">'+
    (meta.author || 'Unknow') +
    '</a>. Edited by <a href="http://www.gnu.org/software/emacs/">Emacs</a>.' +
    ' Generated by <a href="http://orgmode.org/">Org-mode</a>.' +
    ' Hosted by <a href="https://github.com/">Github</a>.</p>'
  body.appendChild(footer)
}

function showTags (body, content, meta) {
  if (!meta.keywords) return
  var keywords = meta.keywords.split(' ')
  if (keywords && keywords.length > 0) {
    var div = document.createElement('div')
    var footnotes = document.getElementById('footnotes')
    var searchEngine = 'https://g.forestgump.me/?gws_rd=ssl#q='
    keywords.forEach(function (key) {
      var a = document.createElement('a')
      a.href = searchEngine +
        key + '+site:' + window.location.hostname
      a.title = 'Go to ' + key
      a.innerText = key
      div.appendChild(a)
    })
    div.id = 'tags'
    content.insertBefore(div, footnotes)
  }
}

function ImgClickEvent (body, wapper) {

  function fun (e) {
    var img = wapper.getElementsByTagName('img')
    var target = e.target
    if (target.nodeName === 'IMG' || target.id === 'img-wapper') {
      if (img.length > 0 || target.id === 'img-wapper') {
        // hide image
        wapper.style.opacity = 0
        body.style.overflow = null
        setTimeout(function(){
          for (var i = 0, max = img.length; i < max; i++) {
            img[i].style.transform = 'scale(1.25977) translateZ(0)'
            wapper.removeChild(img[i])
          }
          wapper.style.display = 'none'
        }, 100)
      } else if (img.length === 0) {
        // show image
        var img = document.createElement('img')
        img.src = e.target.src
        wapper.appendChild(img)
        wapper.style.display = 'block'
        setTimeout(function () {
          wapper.style.opacity = 1
          img.style.transform = 'scale(1.25977) translateZ(0)'
          
        }, 100)
        body.style.overflow = 'hidden'
      }
    }
  }

  if (window.attachEvent) 
    body.attachEvent('click', fun);  //IE浏览器
  else
    body.addEventListener('click', fun, false);  //非IE浏览器
}

/*
 * 用于获取index.html中的分类内容，主要是 articles wiki 这两个分类
 */
function genCategories (body, content) {
  var orgUl = content.children[1]
  var categories = []
  var sTitle = {
    articles: "Articles",
    wiki: "Wiki"
  }
  var navTabs = [], tabContent = []
  if (orgUl) {
    __forEach.call(orgUl.children, function (li, index) {
      var _name, title, children, _tabContent = []
      var div = document.createElement('div')
      _name = li.firstChild.textContent.replace(/\s/g, "")
      title = sTitle[_name]
      children = li.children[0].children

      // TODO: 这里后面需要调整一下，如果URL变化，这样做是不会有什么变化的。
      navTabs.push(
	'<li role="presentation" class="'+_name+'"><a onClick=showTabpane("'+_name+'") href="#'+_name+'">' +
	  title +
	  '</a></li>'
      )
      
      div.className = "tab-pane"
      div.id = _name
      __forEach.call(children, function(c) {
	var a = c.children[0]
	_tabContent.push(
	  a.innerText.replace(
	      /(.*) (\d{4}-\d{2}-\d{2})/,
	    '<li class="link"><a href="'+ a.getAttribute('href') + '">$1</a><p class="date">WROTR AT: $2</p></li>'))
      })
      tabContent.push('<div class="tab-pane" id="'+ _name +'"><ul>'+_tabContent.join(' ')+'</ul></div>')
    })
    content.innerHTML =
      '<ul class="nav nav-tabs" role="tablist">'+ navTabs.join(' ') +'</ul>' +
      '<div class="tab-content">'+ tabContent.join('') +'</div>'
  } else {
    console.error('At Home Page: Parse content Error! The Org UL isnt exist.')
  }
}
function showTabpane (name) {
  /**
   * @param {name} String 这个是点击之后，传入的name
   * @param {_name} String 这个是要被匹配的name
   * @retrun {String} 返回加上active的className
   */
  function addActive (_className, name, _name) {
    _className = _className.replace(/\s*$/g, '')
    if (_name === name && _className.search(rActive) >= 0) {
      // do nothing
    } else if (_name === name) {
      _className += ' active'
    } else {
      _className = _className.replace(rActive, '')
    }
    return _className
  }
  
  __forEach.call(document.getElementsByClassName('nav-tabs')[0].children, function(li) {
    var a = li.children[0]
    var a_name = a.getAttribute('href').slice(1)
    var _className = li.className
    li.className = addActive(_className, name, a_name)
  })
  __forEach.call(document.getElementsByClassName('tab-content')[0].children, function (pane) {
    var _name = pane.id
    var _className = pane.className
    pane.className = addActive(_className, name, _name)
  })
}

function someHomeFix (body, content, pathname) {
  showTabpane(window.location.hash.slice(1))
  // var orgUl = document.getElementsByClassName('org-ul')[0]
  // orgUl.style.listStyleType = 'lower-greek'
  // var style = document.createElement('style')
  // style.innerText = "#content ul {margin-left: 40px;font-size: 1.4em;} #content a {text-decoration: none;}"
  // orgUl.appendChild(style)
  
  // document.getElementById('org-div-home-and-up').style.display = 'none'
}

function someArticlesFix (body, content, isHome) {
  var tableOfContents = document.getElementById('table-of-contents')
  tableOfContents.style.display = 'none'
  function genTagA (h) {
    var a = document.createElement('a')
    a.href = '#' + h.id
    a.innerText = '#'
    return a
  }
  ['h2', 'h3', 'h4'].forEach(function (hTag) {
    __forEach.call(document.getElementsByTagName(hTag), function (h) {
      h.appendChild(genTagA(h))
    })
  })
}

function orgDivHomeAndUpFix (body, content, meta, isHome) {
  var orgDivHomeAndUp = document.getElementById('org-div-home-and-up')
  var Links = [{
    "name": 'HOME', "url": '/'
  }, {
    "name": 'GMAIL', "url": 'mailto:'+meta.gmail
  }]
  var hLinks = []

  if (!orgDivHomeAndUp) {
    orgDivHomeAndUp = document.createElement('div')
    orgDivHomeAndUp.id = 'org-div-home-and-up'
    body.insertBefore(orgDivHomeAndUp, content, false)
  }
  if (isHome) {
    orgDivHomeAndUp.style.position = 'fixed'
    orgDivHomeAndUp.style.right = 0
  }
  
  Links.forEach(function (link) {
    var lname = ''
    
    if (link.name === 'HOME' && isHome) return

    if (link.name.toUpperCase() === 'GMAIL') {
      var colors = ['#0C77B6', '#D82C2D', '#FCCB0A', '#0C77B6', '#31B454']
      link.name.split('').forEach(function (c, i) {
        lname += '<span style="color:'+colors[i]+';">' + c + '</span>'
      })
    } else {
      lname = link.name
    }
    hLinks.push('<a href='+ link.url+'>'+lname+'</a>')
  })
  orgDivHomeAndUp.innerHTML = hLinks.join(' ')
}

function loadDisqus(body, content) {
  var div = document.createElement('div')
  div.className = 'comm'
  div.innerHTML = '<div class="comm_open_btn" comment="copy from bilibili.com :P" onclick="loadDisqusComment(this)"></div>'
  content.appendChild(div)
}
function loadDisqusComment (target) {
  var parent = target.parentElement
  parent.style.display = 'none'
  
  var d = document
  var s = document.createElement('script')
  s.src = '//creamidea.disqus.com/embed.js'
  s.setAttribute('data-timestamp', +new Date());
  (d.head || d.body).appendChild(s);
  
  var content = document.getElementById('content')
  var disqus = document.createElement('div')
  disqus.id = 'outline_disqus_thread'
  disqus.className = 'outline-2'
  disqus.style.marginBottom = '44px'
  disqus.innerHTML = '<h2 id="disqus_thread_header">Comments</h2><div id="disqus_thread"></div>'
  content.appendChild(disqus)
}
function disqus_config () {
  // 这里是配置disqus地方，具体可以参考
  // https://help.disqus.com/customer/portal/articles/472098-javascript-configuration-variables
}

document.addEventListener('DOMContentLoaded', function () {
  var pathname = window.location.pathname
  var body = document.getElementsByTagName('body')[0]
  var content = document.getElementById('content')
  var meta = getMetaInfo(true)
  var isHome = false

  if (window.location.pathname === '/') isHome = true
  orgDivHomeAndUpFix(body, content, meta, isHome)
  
  showTags(body, content, meta)
  if (isHome) {
    genCategories(body, content)
    someHomeFix(body, content, pathname)
    showBanner(body, content)
  } else {
    // showHomeButton(body)
    ImgClickEvent(body, initImgWapper(body, content))
    loadDisqus(body, content)
    someArticlesFix(body, content)
  }
  showFooter(body, content, meta)

}, false);
