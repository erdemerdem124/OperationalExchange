using Microsoft.AspNetCore.Mvc;
using Umbraco.Cms.Web.Website.Controllers;
using Umbraco.Cms.Core.Services;
using Umbraco.Cms.Web.Common.Security;
using Umbraco.Cms.Core.Web;
using Umbraco.Cms.Infrastructure.Persistence;
using Umbraco.Cms.Core.Cache;
using Umbraco.Cms.Core.Logging;
using Umbraco.Cms.Core.Routing;
using Umbraco.Cms.Core.Models.PublishedContent;
using System.Threading.Tasks;

public class GirisController : SurfaceController
{
    private readonly MemberSignInManager _signInManager;
    private readonly IMemberService _memberService;

    public GirisController(
        IUmbracoContextAccessor umbracoContextAccessor,
        IUmbracoDatabaseFactory databaseFactory,
        ServiceContext serviceContext,
        AppCaches appCaches,
        IProfilingLogger profilingLogger,
        IPublishedUrlProvider publishedUrlProvider,
        MemberSignInManager signInManager,
        IMemberService memberService)
        : base(umbracoContextAccessor, databaseFactory, serviceContext, appCaches, profilingLogger, publishedUrlProvider)
    {
        _signInManager = signInManager;
        _memberService = memberService;
    }

    [HttpPost]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> Login(string username, string password)
    {
        var member = _memberService.GetByUsername(username);
        if (member == null)
        {
            TempData["LoginError"] = "Kullanıcı adı veya şifre hatalı!";
            return Redirect("/");
        }

        var result = await _signInManager.PasswordSignInAsync(username, password, true, false);
        if (result.Succeeded)
        {
            return Redirect("/portfoey/");
        }
        else
        {
            TempData["LoginError"] = "Kullanıcı adı veya şifre hatalı!";
            return Redirect("/");
        }
    }

    [HttpPost]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> Logout()
    {
        await _signInManager.SignOutAsync();
        return Redirect("/");
    }
} 