/* eslint-disable indent */
let moment = require('moment');
let template = (body, link, linkName) => {
  return `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width">
    <title></title>
    <link href='http://fonts.googleapis.com/css?family=Roboto' rel='stylesheet' type='text/css'>
    <!--[if !mso]><!-->
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <!--<![endif]-->
    <style type="text/css">
      html, body {
        margin: 0 auto !important;
        padding: 0 !important;
        height: 100% !important;
        width: 100% !important;
      }
      * {
        -ms-text-size-adjust: 100%;
        -webkit-text-size-adjust: 100%;
      }
      div[style*="margin: 16px 0"] {
        margin: 0 !important;
      }
      table, td {
        mso-table-lspace: 0pt !important;
        mso-table-rspace: 0pt !important;
      }
      table {
        border-spacing: 0 !important;
        border-collapse: collapse !important;
        table-layout: fixed !important;
        margin: 0 auto !important;
      }
      img {
        line-height: 100%;
        outline: none;
        text-decoration: none;
        -ms-interpolation-mode: bicubic;
        border: 0;
        max-width: 100%;
        height: auto;
        vertical-align: middle;
      }
      .yshortcuts a {
        border-bottom: none !important;
      }
      a[x-apple-data-detectors] {
        color: inherit !important;
        text-decoration: none !important;
        font-size: inherit !important;
        font-family: inherit !important;
        font-weight: inherit !important;
        line-height: inherit !important;
      }
      @media screen and (min-width: 600px) {
        .ios-responsive-grid {
          display: -webkit-box !important;
          display: flex !important;
        }
        .ios-responsive-grid__unit  {
          float: left;
        }
      }
      .button__td, .button__a {
        transition: all 100ms ease;
      }
      .button__td:hover, .button__a:hover {
        background: #1ab77b !important;
      }
      @media screen and (max-width: 599px) {
        .tw-card { padding: 20px !important; }
        .tw-h1 { font-size: 22px !important; }
        .mobile-hidden {
          display: none !important;
        }
        .mobile-d-block {
          display: block !important;
        }
        .mobile-w-full {
          width: 100% !important;
        }
        .mobile-m-h-auto {
          margin: 0 auto !important;
        }
        .mobile-p-0 {
          padding: 0 !important;
        }
        .mobile-p-t-0 {
          padding-top: 0 !important;
        }
        .mobile-img-fluid {
          max-width: 100% !important;
          width: 100% !important;
          height: auto !important;
        }
      }
      .verify-link {
        background-color: #4098FB;
        /* box-shadow: 0 5px 0 darkred; */
        color: white;
        padding: 1em 1.5em;
        position: relative;
        text-decoration: none;
        text-transform: uppercase;
      }

      .verify-link:hover {
        cursor: pointer;
      }

      .verify-link:active {
        box-shadow: none;
        top: 5px;
      }

      .comment-ava {
        width: 64px;
        height: 64px;
        border-radius: 50%;
      }
    </style>
    <!--[if gte mso 9]>
      <style type="text/css">
        li {
          text-indent: -1em;
        }
      </style>
    <![endif]-->
  </head>
  <body style="background: #ffffff; height: 100% !important; margin: 0 auto !important; padding: 0 !important; width: 100% !important; ;">
    <div style="display: none; font-size: 1px; line-height: 1px; max-height: 0; max-width: 0; opacity: 0; overflow: hidden; mso-hide: all;"></div>
    <table cellpadding="0" cellspacing="0" style="background: #f2f2f2; border: 0; border-radius: 0; width: 100%;">
      <tbody><tr>
        <td align="center" class="" style="padding: 0 20px;">
          <table cellpadding="0" cellspacing="0" style="background: #f2f2f2; border: 0; border-radius: 0;">
            <tbody><tr>
              <td align="center" class="" style="width: 600px;">
                <table cellpadding="0" cellspacing="0" dir="ltr" style="border: 0; width: 100%;">
                  <tbody><tr>
                    <td class="" style="padding: 20px 0; text-align: center;">
                    </td>
                  </tr></tbody>
                </table>
                <table cellpadding="0" cellspacing="0" style="background: #ffffff; border: 0; border-radius: 4px; width: 100%;">
                  <tbody><tr>
                    <td align="center" class="tw-card" style="padding: 20px 50px;">
                      <table cellpadding="0" cellspacing="0" dir="ltr" style="border: 0; width: 100%;">
                        <tbody><tr>
                          <td class="" style="padding: 20px 0; text-align: center; ;">
                            <img alt="" class=" " src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAPIAAAB8CAMAAABkDB0+AAACH1BMVEUAAABOboUAmcwAmsJmZmYOk8QAmcxmZmZlZma59UNkZGQAmc0Ams0AmsxmZmYAnM8AmcwBmcxmZmZmZmYAmswAmc0AmcxmZmYAmcxlZWUAmM1mZmZmZmYAmctmZmZmZmZmZmZmZmYAmM4Cnc/t5EwAmcwAmswAmcwAmcwAmcxmZmYAm83s409mZmZmZmYAmcxnZ2cAmMyZzDMAmMxoaGhmZmZmZmZmZmZmZmZmZmYAmcxmZmZlZWVlZWUAmc1mZmYAmswAmc1mZmYAmcwAmcwAmcxmZmZmZmZlZWWYzjJmZmZmZmYAmcyZyzMAmcyZyzQAmswAmc1mZmYAmMsAmcwAmcyZzDMAmc1mZmZmZmZmZmZmZmZmZmaYzDMAmcxmZmYAmcxmZmYAmcwAmcwAmcxmZmYAmcxmZmZmZmZmZmYAmc1lZWWZzDMAmcwAmcwAmc1nZ2dmZmaZzDOjzj6ZzTP57CyZzDKmzz2ZzDOiwp3Z3UgAkdmh0ABWrKyhwpwdncmdyzQAmczs40+ZzDNqampnZ2cAoNZsbGwAntMAm88AodcAndEAo9oAotjt5E8Aj9dvb2/y5VGbzTPp4lSLyS7q406k2zeh1zYAp98cm8qdzTT26EOiwpzY3UgjnMj46ysAq+Se0zX25lLx50200jzw6UaOyS1To8jn4FZVpMdRocpPoMpQo8ginMja3kiizj0QmstLoMmtyJar0jn77hdv6GFQAAAAgXRSTlMAAvwD/gX++wYCC/lt+fgL2TzhKmKyYBarRjPdY1jy00/mFwY46omG4b6YD/zQ60IQJfsrE1VstfbYoUM/OhydMOW+R/bxc0mlNMt6dfzTvZdmHhPdnKqSkcSvlID7xIdMMcy3fiM3Ni1bUSjupnGZGo6h/jH+u/74/fzv5GU2NCe2qRLjAAAWD0lEQVR42uzYzWsTQRjH8WdmcWkoPXgQpOBJqRehuP+Cp4DirbeAIHiqF7UvvpssBFtMlm22ljS+kMbWJn3x9Q90NrPtAzPbTGxpmX2Y3yHk+uG7MxsCFzMGMHMNLkH+JqA8x6AElMYYzHzgD/LNwlqe/zgHpMxp48bkij8rzZr42Xx3mZiZCTH3+Qq/I81a424QBqTMQrzK/WpVmEVnvXEqDkmZh42FGM1645CSmR01RnOOmJKZwXFjNOtPtVyFhjlrjOYpNGNjQp0ZitXO2JiUGW8urTOKSZkZ3MTGaueJ7KmmZGbpOfaFWDdPzsJ1pTGROwwba+bLx40JdRZPdR3Firn98vWrjUoYkjLjzZWzg6gf/0k2Q1JmbJyzL1F/u9Na2pFmMucZG+eI97c7u734KS3zyMbfe51Wcz2mZE7fx/6J51g0FuJazWR+UiBzKjY0FuLMTOIOM4j7snFm/kHAzIS47p8sHhyJ6XROG48Q/+plYuxc9DvM0Hgfxdg5KfQdZjjHe73OrhAr5qUim5nhfSzPsWJubn0rsnnkOd6TYkpmeY6NjfWNNAfCbOs8uNvgxsanMtua2YOHdW76zXUK872N+2DpPHiMZFU8QLHJrJMXocTAxnlwdZWbG5vNeuXCkYVYvo/NZiLkAxSbzSTI7WhgFuP7mQD5Z7XfRLHRvEOA3I5+/0WxwRwfJmsUyJ8WWrUxF38mQv46LnndkR3ZvjmyIzuyIzuyIzuyPXNkR3ZkR3bkApHr3Fc3/FekeRZyYPVf9w1fqyzJ4622dZhsrqkLba585f0UV9eOni+0bo25+EUSBEElqIiJj+HXYLm7CGAnmcHtR9Pa3k6/ufEfK+ftHdg6O0uc87y8lc46Sw/yP3bMpUdtGIjjwRG5hAhW6qIVEpdF7II4oNXe9oAWEW4IFUHFDa0AcUBa9jP4EtlxcufYj9r/2HnwKKWvU9Vp1TpjZ2Z+9tge8l/+y3/5d6Wg5Qf9v3vK/7HJIsTOzlx6Mm8Xj8TOOo+GFtJx52Nt49v8fy6pz8z3uQ2yciSwdK6184iSl7THczj7eHQ+6LKi8MvXbyGN8axHz0q5XLZ/NoDrvjVow5i0f/hub1cqjd6Sh0Z1V9pNyhTrtHQooxuYGYxKpV0vfXG7g/7eeobyWHbVhvVUX7/frtrt1e28/nQWgg231ffFuDJe3I42DRPHsb+uVt4cGYc3LfXd4ci3zObmob2EyZdtGfymHhxR6ESbhv8JzW4UiK+rJKhOMxKRf0+jn0UYpIIRc6to3e6F2HdpKBlZ7kWoalZpL4IjEVFzar3sg0i/H0fCv3217GPi8kMziAOhBPqHPa3qiuDQ3ztUtjX/eqANxY2x0z9wKfZtigYdzysZh9qkqNRJhYirX4X4+hkN9Nd4iNEjmkjGvPAuiak8lp5sauQnz2GZ+OIR770Il0njFtIWnuO/Wp+Ez47Ek+OO9TlwGXNdD38cHrv1nFlHV4kketHv+XJhdDe5P4roQyM/xm6mc5lfg6pgNWaS5Vpxa94f+LGjPeINET4iUaGsB54XIHS9RIHrhi86dzh34wy5oliKzLjjSKG0yP2ckANYO0Bm3HvFKksMEIpzngyPWx3rI8TrQRTFoWKOK2micuKnZuA6jGOF41jsH6AhZLzAyYCQnLPoi0Z+iBgnJYQ6Nhq53FcUmXHKAiBDvXGVy5kKozhwMHfRGrqiVY8ZC4GMP+uIMTXrQA1kOLiAzP1ZS8usuT5HDjRyvTmjAX0O8U1zgVUOmSPvSpPRS184iGt8eIosY48zwdrrSWn9PqybvOty+IMt+DpBhjKJwmyQaVMxuCJPBpmYxwHN8Ww+GbWldBxHIU47Q0Zi0QqKAXz9EJkFK7ucSMOyv4f8jDOSpFDT3pPhRUJmYqOPh3eMY2qQvAafpcjF2OWreZ5OzVYcUFLVrXLZekPe5ciOqlqdJAhjoteUXvQBpV3zJSFj4CSGEzFv6NPNkw4L2tbBKhcoWhbNMfIKMsxlcgk5kVd+MDxB7loNG+lVEfA2gtJIY6bQN8apqsVKztM36XDepYeBPEaun/4sH0oX0Rfg1JWJ00UANrSKZLEUMkxfzWokyGjsYvJJM3J1lbMi6iKyTb04Dw2yrYdnyDYI9S6KPzQZWakLhlSvZVMAvV4QSgZs1iIhs2PkYsGIMVDzgfxgFdHyEqevDiebaJksF/C4zpGtJ18isan/OjIMGzlAbuAR6rbQyCaOC6tsU3tCK/Ce5coXzEBADnOhUaPI1ebsM+QqPGpJDNwgsnhk2SkyXt5RZMvM1mMIF+0D5BUUER1H15Hv8nxKkbNUXgU/ifwIxuhzythY0hJUT5BxBUeu9HFFnyC7jtqejOySq5JVPECeAy1+RF8yQsB7pWwZ5AeadC9cAOI6slhWjUy6ySo7cl3/ZHRjdR25gTxtYC+70Q5KPXP3LQkrN8fI0N8GTA6nZ8gY+znxOOlZ6a5nqn6wyjicaBUnGfKTz2Hs2SBHow7SOh4+oeMqMt1+WtQeG0Yjcy5Skdy5glzTMF+wdzPGAp23FM5ZGbwQOF+K54nNuUqDwKZOd70c5MjQLQKgUb2T++D8RiM7coGtzZcb6r2OzJ2kGBJfMmSWinMNWa1vBm/rZeBwN0BWpeEMJVz00Dpa5HJLmffPkdM6S75Bo4sKlzs3OXKyWcJthjxtKaB2CRkUQuKf5JK8jsyVFhm9Z8hSJcKvIONlyVUkGJKMo4j4MfIznUlf0DhHNh6ljLemaPkMJasdIwc/QJYCIHz9k6vst/okreFHhtyESot7FRkJzTykQ8BNzl1ObNqg3Fze58jDNIg389JdyPRBd5rY1QuJ3RqjQOXRJ919/ZKa9u5Jep30+FKDDlQkuKSurrKUSkSqnaxxfnyp7inyI85mnbnnx9eknATR0AaKY9r1KAAO7uVVDORSdnz1fJkfX/GjPt2kr8+v36m+NulzO7iGPGsNm5X2fGDlfHrf5eHlnxJuQ1cOn7LEvlx9aR7RRuPkkgo/MuSNdJiY5ZfU0xCKwNxS10sRu6DlsOCkWgjDr60yDb2f2kSU46HrJULX4uTEng7BMdbV9uXqK7+jzK7PkUsU2ayYlTWnpcgnrEBeixByDGTyliHbdo58uca+fi/rvpMUrtKlJbYIiKSAbozfCnDM0SAmg1w8QD5IEtQswKhClyEnv5PUm7Fpo+I+KjjRuMWm5hLLlSC70V1qUCNP0coT+0+Qi+g+lXKfSonmE4ZB8lKOBW/USn5WfKDx3cTGiQ+/OLBzZAhBBssCTNpmUjl/PUSe4kDTuV7IE3vaIbkHsur3Op1issrlTiLl30GG/kzMvcpEc2s6N1tr2qAgxFg7mhbfuEaeltMa2zbBIapipwe3tAUgOTIoY10f68Wq+5jTcGUV8h+PSKOAmd9nBtmRw0oiHv0imVVaNZ0rPNO37v4SMqQ8o7taieV8NJq31eJ+XGlKB0GMZ8aXjmjcv7PMJdVPg+gPnitD4SD0ESwfrTJ95kG7/zF6XAgY43Jz+ImAgocpJrBJDHL2rUVxEqXiG0LO9TJaYOzfQbbhUri4skUUBHGgWvfDUDqEaZwJyekBLg1yHlw0GOw5zRa2XiFHNv4ZbDIZwyJMO3pS8lXG8E5LMNxcPVplU80lQm0HXRvrGRZyvVoRsvBcmSMrz/FzZCpL7zLkuXBdmSKfM/cjDtuei79MbmeK8bMgXLqIHkMv03ue7E4inzGlUGcZp77jpZ/7usMYRsgkJjtYW5b53Oeaz33425UU4sp81A3CQ4mRFwqrLOJc/408q2dtGAaicou7tFAPqYdAFosmhE5ePYRAna2EBFOymrRkCLj5DV6Mk5Bdo39qn3KVZbnRYkiXvsHynU/3IbB1firEWpK6oFgNUvdUTiHRVghCVYzrkjNpqvvads1BFoPyLcsC8Lag7/KDiSI/UzkgdRs6sR3B7el5UAdFBpUidSdPd+TzUM63jGlSF/TPWRgKPKqGjE3wZ9Zrwkd3c9ywxO/5WrdM5eos8QcXqMTTJSwShKO2Vhq96s5dmk6YBUghfHgfe946G6Y8iPf7GZw1MBhRyf2mGg7D0W7VS+qVDHwdFLrpZwbq/mOVcrW3hjKNDSOBwxoipDZAW9yj5F/ockBjfXBOmnPKa5ajNTHxEuco+dayYhfdU5WPDrMe0OjoJjjew1h+71pgjFQ0U0uGGx2fJDvkXBqw096UEUgODRc9UX5Eya3kmEMx7UHVVUHZa+vL+2ZVCPpIXRnOz8HR/lQt2lyYJ8S8Uw5Olyn9aBGFGP8KyWqXpe14X1H0xv4frrnqDkGJLufqBSC1owHJLhuT6ntmmNWjVrsud5W+eWCvJMO5oVKjIZpW+u6bcrJpbRwGwvAIBBI++JAcgknIx7UQ40OSujjB0EMc0ptPmw8oOZR06WX7HyR0zU/ed6S4bsqWshNieSxp5n1GI/1Z1Q8lvk323brW+2Gn+Ob5dWv7+BpA/G9ztKmboTd+OryvxzUFi4qievHTYplUXcwnRZGwFckfTpgVydWvXrFKn8e/B4vFYH7y0cQqSU7X0HWVZKIqkqWGM8OuiMeqqM4+Sx2y0KlaCdJI1mtFdqvqDQOnY3mD06cC1fPj4X0x7kWNEBiSiCxBzBbsreLETYjnAVBCvug5tc45Y7baK6ZXJd0RI1am1myI5kYGU2bAAc6xvfpuQ5q6Q+PNqu2YIP3BmscQKcNrQjvD+zQlRtoTxoOL3ZpOscQTyziemUT0Z2LNvsFizx38gS461kCeum8KNLsbBsH359zKD7NDsbTKLFrkO2fTHnGIid8Ql5HH6k0vVrLgy/01ZBfIT34uQrY7ojGQrYdyjAy11vsNcmwVuxxmTKSn1twHlo1TtqCTlOZBCyqAjK54iaXZEgolWR7/RsY+RNTrWIX9Osj9hbr84mSHi1U+uEu7fvlbx8kg+L2WxvJUUJeLs5Rc3Ab54OxkhvHoPKGUl2lEsN0ltnZXlpv+ukGOvyIjaNrvdDr9ydyfspJyAlddkXNpHo/Pdx0Tm6n4QBboDiXtkqh0MZQAWQGZYUDWIAc6278ij8RHpykgaxo4Jc2u3KQIPtK+ibBfPpblfvK7x6I6sZQ5hsno38iUABaE+9jGlxITA+RLK4LpjOibU8ahzsUsg2lesJQ2X0VZ3bcN8gVENBsZmb81yOif1DJyONeppsI3dj0EAokGWXtFJiAD8ykg751iZIr6qNMawesHw9dB0/ESm86KYFEmoGgWbdHiEb/RSnlkcYvMF4tDrFIkQM0hE6oEjOgGWfOtb5ErahdU1g5fiLIW2S1IR7Q2cvgJeQ8WDq7p2SkzD3fZH3JC+oqsuawtMi5kzVsLZPTIc8jd4IsmPsEdJEF3/toKhjFyeAvIgmcb5B6d8HGP2qJjTAywc/A9irhBZi/6ihz+AycZeXaLTFSatrE1r0pzy8h83mbrkbuzXIaCNMilkxMVkP9WbgatqQNBHN/AQkIOOaQHKZEYr0KCB7UNKoEctOjN09MnSA9SxYvvO8yy13zk959dkza+V3lvaJvdjTs7v+zszEQo5VulC9a0rfKdYuQBNnluN/4FPnTkZ6AH1nfrlG+R0TLIZzHyzc0aeaIDDPKMK8woDXgT4z6R2YU8z2ntsgexyGvADIHcdmxvIYnDm0UWx1cVjzNGdnhGQNMjSRquEdE+PpGBQOmalEUOJ1KCUJxJD34RI5ckM45A7NGE6Gb/tqqGZpeBDLdK0364LZ4/Hfug5euTnYE42RcLWPD8J7LKeiy5K+uIHXI/KvjxQYlKhfMVWW0Hu5xkzl51Qy6JdjMlLbIfatU74Cgt+vwQneYsbzJZLdbaIis1TYm2OMCKpltGHkYmmDvGt0yuGyCcPT1CVqQUafppkF03T2OclmvjKLE4YHT+B7LNQSYNfU1SqioN8gvWaCEraTJncNg0yLybx4SAbFNhidkwSPM5gtTIOyA5A7ohUxfRVD8nmkq/D8fmJZpyIQHyBHlPBg+RSUmY4lZrwcgSVgPZZGcTXQKx/w7ZyhdkFg1kAOSKijvkII5dUqRujr07mnLmrGrk95TcHAbFUgb7Gll3l9pFLCsa5IVI4RxvpOZ+do88/gdk+OfbdNktyUURYjxCqTbyq5iYWOrdOza9JefxedzNZJ2XDxgYn2emimRjhdcKX+vO5WOSQf2Jd1kvfmnawsrasY+vpIsTlyKIVnppz7JSyYpsjPpEnnE9BbUds8seTl84tPZOjGP/4ljwABk0EDDTEsgy6yYvxGkAYiMDAkWgD38NX0aiJnzNmvtcf7JntJA5L5toegAyqSIk90k0yFyGBZ05kI9XV9p6A8hxweVFG1kUYHIvN2Tjihu77AEYM7Hm9PwIuStsOgL7AOHLE4vKlTObayIshMcvVeTd3vEe5eVE+B4EfmsDIaeedpLCAFYsGNmVJubfkLkIQfVo8zLssCUFkKXi+Oy1ka+xpIOokQ86YAi2b0sSKWcK8JXACMtD5MQgX7ERWNDgXF7hvrzXAaisPKq+ZqIWD4OFaeRKc8MiO8IEmAEjSxdxVzSOLTASb27Im1jxOTPILnuY00L2xOQ19BvkOReh6HLicvWOF8Ui+8bWP5HPN8dWU4PcYU2sXpjnx+64RHRDNhn5nS785VtkuV+Ox+PkfNkkv7DmYckdJJxymTTVV9JXUGl2WaFocGpkscBSe1G/VuzR+8nITOPcIyPiH3DWLTKuJba5/PA7k0Dx8fS4QoYvfQz9zeIsnD+R96Pj7I0Cyj2DPELgZhUnv7OHNX2uqovKDZCh87hKha3TLoFLNbKkn4zsujaAV/txhc1xpe2iQZkPf5HZahuRcquVB2RlyxtG5mN0zZDnR0BGD8ijDNcPcULwxsXh/GnfpCKDbB47I0tC+EK5SDAvyuA5VWEO4EuFTVJhFJuUycjqCzIyQqAIm3YGK0lG7mRQIaOYR7tmSkGkGIEIBphdVlTV78uEdcRYkxVVrRMNjZ8iESDwecVjivR2w66nq9KacMbEqdhVquLS8hm9d1zX6K/EybWr4KeoqA9kLIYQYrBgZ0zVgNmfY83mSULcsFXwS21w0DGr9Jr1ZrjDQlpOrN54xBmyf1PRnIik7MPoOP/Rsf1jmoYTi7ztRQc4f5T2jKRhd4ySGL1aAhi7WYXZaxDEUdnlSd5LvrpYliRPo/enPM1fPN4DNJ5Ya5mn4fS6yneO/dgh6pVALntRt/mKYFT2Qutql7fQJYq3ZoPMb3ebKUKBuLdv/Ls8H9hJp1XUhyX9XvHOT2sPvSPjMoNQYkKZNCrE9eN5fvRtG+L7vve15fi1DBELaSKGdd9LNdKm3zk+nU6X0U2bhzl8tROFD7FspoGW55vxZkHu17drcWojMDR6f54dm/cevmzmMBi36+lNc7S5nJ42fm0INDYq5hue+19fo9mPTrT6WtWXlQkIdxoe/0OM0249lraZttGMPJzT7t6POkZa3VbLaUR03QyptOn+kL3h/beu983mXnNlsb32Kvc2tez79lvor80a5XsVvwHxnUllXfHuAgAAAABJRU5ErkJggg==">
                          </td>
                        </tr></tbody>
                      </table>
                      <table cellpadding="0" cellspacing="0" dir="ltr" style="border: 0; width: 100%;">
                        <tbody><tr>
                          <td class="" style="padding: 20px 0; text-align: left; color: #474747; font-family: sans-serif;">
                            ${body}
                          </td>
                        </tr></tbody>
                        <tbody><tr>
                          <td class="" style="padding: 20px 0; text-align: center; font-family: Roboto;">
                            <a href=${link} class="verify-link">${linkName}</a>
                          </td>
                        </tr></tbody>
                      </table>
                    </td>
                  </tr></tbody>
                </table>
                <table cellpadding="0" cellspacing="0" dir="ltr" style="border: 0; width: 100%;">
                  <tbody><tr>
                    <td class="" style="padding: 20px 0; text-align: center; color: #8f8f8f; font-family: sans-serif; font-size: 12px; mso-line-height-rule: exactly; line-height: 20px;;">
                      <p style="margin: 20px 0;; margin: 0;;">
                        Если Вы получили это письмо по ошибке, то просто проигнорируйте! Спасибо!
                      </p>
                      <p style="margin: 20px 0;; margin: 0;;">
                        &lt;&nbsp;/&nbsp;&gt; with ♡ by Tarasenko_PS
                      </p>
                    </td>
                  </tr></tbody>
                </table>
              </td>
            </tr></tbody>
          </table>
        </td>
      </tr></tbody>
    </table>
  </body>
</html>`;
};

module.exports = {
  'callMeBack' (payload) {
    let body = `
      <p style="margin: 20px 0; font-size: 14px; mso-line-height-rule: exactly; line-height: 24px; margin: 30px 0;">
        <span style="font-weight: bold;;">Заявка на обратный звонок</span>
      </p>
      <p style="margin: 20px 0; font-size: 14px; mso-line-height-rule: exactly; line-height: 24px; margin: 30px 0;; ;">
        Имя: ${payload.name}<br>
        Телефон: ${payload.tel}
      </p>
    `
    ,link = {
      url: '',
      text: ''
    };

    return template(body, link.url, link.text);
  },
  'repeatEvent' (payload) {
    let body = `
      <p style="margin: 20px 0; font-size: 14px; mso-line-height-rule: exactly; line-height: 24px; margin: 30px 0;">
        <span style="font-weight: bold;;">Заявка на повтор семинара</span>
      </p>
      <p style="margin: 20px 0; font-size: 14px; mso-line-height-rule: exactly; line-height: 24px; margin: 30px 0;; ;">
        Имя: ${payload.name}<br>
        Телефон: ${payload.tel}<br>
        Семинар: ${payload.title}
      </p>
    `
    ,link = {
      url: '',
      text: ''
    };

    return template(body, link.url, link.text);
  },
  'resume' (payload) {
    let body = `
      <p style="margin: 20px 0; font-size: 14px; mso-line-height-rule: exactly; line-height: 24px; margin: 30px 0;">
        <span style="font-weight: bold;;">${payload.name} прислал свое резюме (в приложении)</span>
      </p>
      <p style="margin: 20px 0; font-size: 14px; mso-line-height-rule: exactly; line-height: 24px; margin: 30px 0;; ;">
        Имя: ${payload.name}<br>
        Телефон: ${payload.tel}
      </p>
    `
    ,link = {
      url: '',
      text: ''
    };

    return template(body, link.url, link.text);
  },
  'question' (payload) {
    let body = `
      <p style="margin: 20px 0; font-size: 14px; mso-line-height-rule: exactly; line-height: 24px; margin: 30px 0;">
        <span style="font-weight: bold;;">${payload.name} спрашивает: ${payload.question}</span>
      </p>
      <p style="margin: 20px 0; font-size: 14px; mso-line-height-rule: exactly; line-height: 24px; margin: 30px 0;; ;">
        Контактные данные:<br>
        Имя: ${payload.name}<br>
        Телефон: ${payload.tel}<br>
        Email: ${payload.email}
      </p>
    `
    ,link = {
      url: '',
      text: ''
    };

    return template(body, link.url, link.text);
  },
  'emailConfirm': (user, password) => {
    let body = `
      <p style="margin: 20px 0; font-size: 14px; mso-line-height-rule: exactly; line-height: 24px; margin: 30px 0;">
        <span style="font-weight: bold;;">Регистрация прошла успешно!</span>
      </p>
      <p style="margin: 20px 0; font-size: 14px; mso-line-height-rule: exactly; line-height: 24px; margin: 30px 0;; ;">
        Ваши данные:<br>
        Email: ${user.email}<br>
        Пароль: ${password}<br>
      </p>
      <p style="font-size: 14px; mso-line-height-rule: exactly; line-height: 24px; margin: 10px 0;; ;">
        Осталось только подтвердить адрес электронной почты :)
      </p>
    `
    ,link = {
      url: `http://app.centr-sdelok.ru/api/verify/${user._id}/${user.confirmHash}`,
      text: 'Подтвердить E-mail'
    };

    return template(body, link.url, link.text);
  },
  'recEvent': (event) => {
    let body = `
      <p style="margin: 20px 0; font-size: 14px; mso-line-height-rule: exactly; line-height: 24px; margin: 30px 0;">
        <span style="font-weight: bold;;">Вы записались на семинар в Центр сделок с недвижимостью</span>
      </p>
      <p style="margin: 20px 0; font-size: 14px; mso-line-height-rule: exactly; line-height: 24px; margin: 30px 0;; ;">
        ${event.title}<br><br>
        Дата и время: ${moment(event.time).format('LLLL')}<br>
      </p>
      <p style="font-size: 14px; mso-line-height-rule: exactly; line-height: 24px; margin: 10px 0;; ;">
        Мы свяжемся с Вами в ближайшее время для уточнения информации.
      </p>
    `
    ,link = {
      url: 'http://centr-sdelok.ru/',
      text: 'Перейти на сайт'
    };

    return template(body, link.url, link.text);
  },
  'recordManager': (payload) => {
    let body = `
      <p style="margin: 20px 0; font-size: 14px; mso-line-height-rule: exactly; line-height: 24px; margin: 30px 0;">
        <span style="font-weight: bold;;">Новая онлайн запись с сайта</span>
      </p>
      <p style="margin: 20px 0; font-size: 14px; mso-line-height-rule: exactly; line-height: 24px; margin: 30px 0;; ;">
        Услуга: ${payload.data.service}<br>
        Email: ${payload.user.email}<br>
        ФИО: ${payload.user.lastName} ${payload.user.firstName}<br>
        Телефон: ${payload.user.phone}<br>
        Дата и время: ${payload.date.toLocaleDateString('ru-RU')} ${payload.data.title.substring(0, 5)}<br>
        Объектов: ${payload.data.objAmount}<br>
        Условия: ${payload.data.packConditions}<br>
      </p>
    `
    ,link = {
      url: '',
      text: ''
    };

    return template(body, link.url, link.text);
  }
};