@echo off
echo ========================================
echo    VUONG CUONG 68 - DEPLOY SCRIPT
echo ========================================
echo.

echo [1/5] Checking Git status...
git status --porcelain
if %errorlevel% neq 0 (
    echo ERROR: Git not initialized!
    pause
    exit /b 1
)

echo.
echo [2/5] Adding all changes...
git add .

echo.
echo [3/5] Committing changes...
set /p commit_msg="Enter commit message (or press Enter for default): "
if "%commit_msg%"=="" set commit_msg=Update: Ready for deployment

git commit -m "%commit_msg%"

echo.
echo [4/5] Checking remote repository...
git remote -v
if %errorlevel% neq 0 (
    echo.
    echo WARNING: No remote repository found!
    echo Please add GitHub remote first:
    echo git remote add origin https://github.com/YOUR_USERNAME/vuong-cuong-68-motorcycle.git
    echo.
    pause
    exit /b 1
)

echo.
echo [5/5] Pushing to GitHub...
git push origin main
if %errorlevel% neq 0 (
    echo.
    echo Trying to push to master branch...
    git push origin master
)

echo.
echo ========================================
echo           DEPLOY COMPLETED!
echo ========================================
echo.
echo Next steps:
echo 1. Go to Render.com
echo 2. Create new Web Service
echo 3. Connect your GitHub repository
echo 4. Add environment variables
echo 5. Deploy!
echo.
echo Your website will be live at:
echo https://vuong-cuong-68-motorcycle.onrender.com
echo.
pause